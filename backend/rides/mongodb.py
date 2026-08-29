import pymongo
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

# Real MongoDB Database Connection
_db_instance = None

def get_db():
    global _db_instance
    if _db_instance is not None:
        return _db_instance

    try:
        client = pymongo.MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=2000)
        client.server_info()
        _db_instance = client[settings.MONGO_DB_NAME]
        logger.info("Connected successfully to real MongoDB database!")
        return _db_instance
    except Exception as e:
        logger.warning(f"MongoDB connection notice: {e}. PyMongo fallback storage layer active.")
        return None
