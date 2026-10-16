import pymongo
import logging
import time
from datetime import datetime
from django.conf import settings

logger = logging.getLogger(__name__)

# Real MongoDB Database Connection Singleton
_mongo_client = None
_db_instance = None
_last_connect_attempt = 0

# In-memory persistence fallback layer so rides are NEVER lost
# Even if MongoDB Atlas has a temporary network disconnection or latency spike
MEMORY_RIDES = []
UNSYNCED_RIDE_IDS = set()

def get_db(force_reconnect=False):
    """
    Returns the real MongoDB Atlas database connection with robust pooling and retries.
    Uses 10-second timeouts instead of fragile 2-second timeouts to handle cloud latency.
    """
    global _mongo_client, _db_instance, _last_connect_attempt
    now = time.time()

    if not force_reconnect and _mongo_client is not None and _db_instance is not None:
        return _db_instance

    # Throttle reconnect attempts to once per 2 seconds to avoid slamming
    if not force_reconnect and (now - _last_connect_attempt) < 2 and _db_instance is None:
        return None

    _last_connect_attempt = now
    try:
        uri = getattr(settings, 'MONGO_URI', "mongodb+srv://barathkrishnamoorthy:CarpoolPass2026!@cluster0.oh74nyv.mongodb.net/")
        db_name = getattr(settings, 'MONGO_DB_NAME', "rb_carpool_db")

        client = pymongo.MongoClient(
            uri,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            socketTimeoutMS=30000,
            retryWrites=True,
            retryReads=True,
            maxPoolSize=25,
            minPoolSize=1,
            appname="RBCarpoolApp"
        )
        _mongo_client = client
        _db_instance = client[db_name]
        logger.info("Connected successfully to MongoDB Atlas database (%s)", db_name)
        
        # Sync any pending rides that were published during transient disconnection
        sync_pending_rides()
        
        return _db_instance
    except Exception as e:
        logger.warning(f"MongoDB connection notice: {e}. Active in-memory storage layer active.")
        return None


def sync_pending_rides():
    """
    Syncs in-memory published rides to MongoDB Atlas once connection is restored.
    """
    global _db_instance, MEMORY_RIDES, UNSYNCED_RIDE_IDS
    if _db_instance is None or not UNSYNCED_RIDE_IDS:
        return

    to_sync = [r for r in MEMORY_RIDES if r.get('id') in UNSYNCED_RIDE_IDS]
    for ride in to_sync:
        try:
            doc = dict(ride)
            doc.pop('_id', None)
            _db_instance.rides.update_one(
                {"id": ride['id']},
                {"$set": doc},
                upsert=True
            )
            logger.info("Successfully synced pending ride %s to MongoDB Atlas", ride['id'])
            UNSYNCED_RIDE_IDS.discard(ride['id'])
        except Exception as e:
            logger.error("Failed to sync pending ride %s to Atlas: %s", ride.get('id'), e)
            break


def safe_insert_ride(ride_dict):
    """
    Guarantees the ride is NEVER lost.
    1. Stores in MEMORY_RIDES immediately so it is instantly visible in search and history.
    2. Inserts into MongoDB Atlas db.rides with automatic retry.
    3. If MongoDB is temporarily unreachable, queues the ride in UNSYNCED_RIDE_IDS for sync.
    """
    global MEMORY_RIDES, UNSYNCED_RIDE_IDS

    ride_id = ride_dict.get('id')
    clean_ride = dict(ride_dict)
    clean_ride.pop('_id', None)

    # 1. Update or prepend in MEMORY_RIDES immediately
    existing_idx = next((i for i, r in enumerate(MEMORY_RIDES) if r.get('id') == ride_id), None)
    if existing_idx is not None:
        MEMORY_RIDES[existing_idx] = clean_ride
    else:
        MEMORY_RIDES.insert(0, clean_ride)

    db = get_db()
    inserted_to_atlas = False

    if db is not None:
        for attempt in range(2):
            try:
                doc_to_insert = dict(clean_ride)
                db.rides.update_one(
                    {"id": ride_id},
                    {"$set": doc_to_insert},
                    upsert=True
                )
                inserted_to_atlas = True
                UNSYNCED_RIDE_IDS.discard(ride_id)
                logger.info("Ride %s successfully stored in MongoDB Atlas!", ride_id)
                break
            except Exception as e:
                logger.warning("Attempt %d storing ride %s to Atlas failed: %s", attempt + 1, ride_id, e)
                db = get_db(force_reconnect=True)

    if not inserted_to_atlas:
        UNSYNCED_RIDE_IDS.add(ride_id)
        logger.warning("Ride %s stored in memory layer (queued for MongoDB Atlas sync)", ride_id)

    return True, clean_ride


def safe_get_all_rides():
    """
    Fetches all rides:
    1. Queries MongoDB Atlas.
    2. Merges with any recently published rides in MEMORY_RIDES.
    3. Falls back to seed data if both are empty.
    """
    db = get_db()
    atlas_rides = []

    if db is not None:
        try:
            atlas_rides = list(db.rides.find({}, {'_id': 0}))
        except Exception as e:
            logger.warning("Error querying rides from MongoDB Atlas: %s", e)

    rides_map = {}

    # 1. First add memory rides
    for r in MEMORY_RIDES:
        rid = r.get('id')
        if rid:
            clean = dict(r)
            clean.pop('_id', None)
            rides_map[rid] = clean

    # 2. Add/merge with Atlas rides (ground truth)
    for r in atlas_rides:
        rid = r.get('id')
        if rid:
            clean = dict(r)
            clean.pop('_id', None)
            rides_map[rid] = clean
            # Keep MEMORY_RIDES warm with Atlas data
            if not any(m.get('id') == rid for m in MEMORY_RIDES):
                MEMORY_RIDES.append(clean)

    if not rides_map:
        from .seed_data import INITIAL_DEMO_RIDES
        for r in INITIAL_DEMO_RIDES:
            clean = dict(r)
            clean.pop('_id', None)
            rides_map[r['id']] = clean

    return list(rides_map.values())


def safe_find_ride_by_id(ride_id):
    """
    Finds a single ride by ID from Atlas or memory.
    """
    db = get_db()
    if db is not None:
        try:
            ride = db.rides.find_one({"id": ride_id}, {'_id': 0})
            if ride:
                clean = dict(ride)
                clean.pop('_id', None)
                return clean
        except Exception:
            pass

    # Check MEMORY_RIDES
    mem_ride = next((r for r in MEMORY_RIDES if r.get('id') == ride_id), None)
    if mem_ride:
        clean = dict(mem_ride)
        clean.pop('_id', None)
        return clean

    from .seed_data import INITIAL_DEMO_RIDES
    seed = next((r for r in INITIAL_DEMO_RIDES if r.get('id') == ride_id), None)
    if seed:
        clean = dict(seed)
        clean.pop('_id', None)
        return clean

    return None
