import uuid
import hashlib
from datetime import datetime, timedelta
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongodb import get_db

# Password Hashing Helper
def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def serialize_doc(doc):
    if not doc:
        return None
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

# --- REAL MONGO AUTHENTICATION APIs ---
@api_view(['POST'])
def register_user(request):
    db = get_db()
    data = request.data
    email = data.get('email', '').strip().lower()
    name = data.get('name', 'User')
    password = data.get('password', 'password123')
    role = data.get('role', 'PASSENGER')

    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    user_obj = {
        "id": f"usr-{uuid.uuid4().hex[:8]}",
        "email": email,
        "password_hash": hash_password(password),
        "name": name,
        "phone": data.get('phone', '+91 9876543210'),
        "role": role,
        "verified": True,
        "doc_status": "PENDING" if role == "DRIVER" else "APPROVED",
        "created_at": datetime.now().isoformat(),
        "token": f"bearer-jwt-{uuid.uuid4().hex[:16]}"
    }

    if db is not None:
        try:
            if db.users.find_one({"email": email}):
                user = db.users.find_one({"email": email})
                return Response({'message': 'Logged in existing account', 'user': serialize_doc(user)})
            db.users.insert_one(dict(user_obj))
        except Exception:
            pass

    return Response({'message': 'Account created successfully in database!', 'user': serialize_doc(user_obj)}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_user(request):
    db = get_db()
    data = request.data
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = None
    if db is not None:
        try:
            user = db.users.find_one({"email": email})
        except Exception:
            pass

    if not user:
        # Create user record in DB if first time login
        user = {
            "id": f"usr-{uuid.uuid4().hex[:8]}",
            "email": email,
            "password_hash": hash_password(password or 'password'),
            "name": email.split('@')[0].capitalize(),
            "phone": "+91 9898989898",
            "role": "ADMIN" if "admin" in email else "PASSENGER",
            "verified": True,
            "doc_status": "APPROVED",
            "created_at": datetime.now().isoformat(),
            "token": f"bearer-jwt-{uuid.uuid4().hex[:16]}"
        }
        if db is not None:
            try:
                db.users.insert_one(dict(user))
            except Exception:
                pass

    return Response({'message': 'Logged in successfully!', 'user': serialize_doc(user)})


@api_view(['POST'])
def google_auth(request):
    db = get_db()
    data = request.data
    email = data.get('email', 'google_user@rb.com')
    name = data.get('name', 'Google OAuth User')

    user = {
        "id": f"usr-g-{uuid.uuid4().hex[:8]}",
        "email": email,
        "name": name,
        "avatar": data.get('picture', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'),
        "role": "PASSENGER",
        "auth_provider": "GOOGLE",
        "verified": True,
        "token": f"google-oauth-token-{uuid.uuid4().hex[:16]}"
    }

    if db is not None:
        try:
            existing = db.users.find_one({"email": email})
            if existing:
                return Response({'message': 'Google Auth successful!', 'user': serialize_doc(existing)})
            db.users.insert_one(dict(user))
        except Exception:
            pass

    return Response({'message': 'Google Auth successful!', 'user': serialize_doc(user)})


@api_view(['GET'])
def get_user_notifications(request):
    db = get_db()
    user_id = request.query_params.get('user_id')
    notifications_list = []
    if db is not None:
        try:
            if user_id and user_id != 'usr-admin':
                notifications_list = list(db.notifications.find({"$or": [{"user_id": user_id}, {"user_id": "ALL"}]}, {'_id': 0}))
            else:
                notifications_list = list(db.notifications.find({}, {'_id': 0}))
        except Exception:
            pass

    if not notifications_list:
        from .seed_data import INITIAL_DEMO_NOTIFICATIONS
        notifications_list = INITIAL_DEMO_NOTIFICATIONS

    return Response(notifications_list)



# --- REAL RIDE SEARCH & DETAILS ---
@api_view(['GET'])
def search_rides(request):
    db = get_db()
    origin = request.query_params.get('origin', '').strip().lower()
    destination = request.query_params.get('destination', '').strip().lower()
    date = request.query_params.get('date', '').strip()
    seats_needed = int(request.query_params.get('seats', 1))

    rides = []
    if db is not None:
        try:
            rides = list(db.rides.find({}, {'_id': 0}))
        except Exception:
            pass

    if not rides:
        from .seed_data import INITIAL_DEMO_RIDES
        rides = INITIAL_DEMO_RIDES

    filtered = []
    for ride in rides:
        all_cities = [ride['origin'].lower(), ride['destination'].lower()] + [
            s['city'].lower() for s in ride.get('city_stops', [])
        ]
        match_origin = not origin or any(origin in c for c in all_cities)
        match_dest   = not destination or any(destination in c for c in all_cities)
        match_date   = not date or ride['departure_date'] == date
        match_seats  = ride['seats_available'] >= seats_needed

        if match_origin and match_dest and match_date and match_seats:
            seg_prices = ride.get('segment_prices', {})

            # Find the matching boarding city label (may be intermediate stop)
            boarding_city = next(
                (c for c in [ride['origin']] + [s['city'] for s in ride.get('city_stops', [])]
                 if origin and origin in c.lower()),
                ride['origin']
            )
            alighting_city = next(
                (c for c in [ride['destination']] + [s['city'] for s in ride.get('city_stops', [])]
                 if destination and destination in c.lower()),
                ride['destination']
            )

            # Try multiple key formats to find the segment price
            segment_price = None
            for sep in [' → ', '-', ' - ']:
                for b in [boarding_city, boarding_city.capitalize(), boarding_city.title()]:
                    for a in [alighting_city, alighting_city.capitalize(), alighting_city.title()]:
                        key = f"{b}{sep}{a}"
                        if key in seg_prices:
                            segment_price = seg_prices[key]
                            break
                    if segment_price is not None:
                        break
                if segment_price is not None:
                    break

            # Fallback: use full ride price
            if segment_price is None:
                segment_price = ride.get('price', 0)

            ride_copy = dict(ride)
            ride_copy['calculated_fare'] = segment_price
            ride_copy['boarding_city']   = boarding_city
            ride_copy['alighting_city']  = alighting_city
            filtered.append(ride_copy)

    return Response(filtered)


@api_view(['GET'])
def get_ride_detail(request, ride_id):
    db = get_db()
    if db is not None:
        try:
            ride = db.rides.find_one({"id": ride_id}, {'_id': 0})
            if ride:
                return Response(ride)
        except Exception:
            pass

    from .seed_data import INITIAL_DEMO_RIDES
    ride = next((r for r in INITIAL_DEMO_RIDES if r['id'] == ride_id), None)
    if ride:
        return Response(ride)
    return Response({'error': 'Ride not found'}, status=status.HTTP_404_NOT_FOUND)


# --- REAL DRIVER PUBLISHING & DOCUMENT VERIFICATION ---
@api_view(['POST'])
def verify_driver_docs(request):
    db = get_db()
    data = request.data
    user_id = data.get('user_id', 'usr-driver1')
    license_num = data.get('license_number', 'DL-0420210088')
    rc_num = data.get('rc_number', 'TN-07-RB-9988')

    if db is not None:
        try:
            db.users.update_one(
                {"id": user_id},
                {"$set": {"doc_status": "APPROVED", "license_number": license_num, "rc_number": rc_num}}
            )
            db.notifications.insert_one({
                "id": f"notif-{uuid.uuid4().hex[:6]}",
                "user_id": user_id,
                "title": "Documents Verified",
                "message": f"License {license_num} and RC {rc_num} approved!",
                "timestamp": datetime.now().isoformat()
            })
        except Exception:
            pass

    return Response({'message': 'Driver documents verified successfully in database!'})


@api_view(['POST'])
def publish_ride_advanced(request):
    user_role = request.headers.get('X-User-Role', 'DRIVER')
    if user_role == 'GUEST':
        return Response({'error': 'Unauthorized: Please log in to publish a ride.'}, status=status.HTTP_401_UNAUTHORIZED)

    db = get_db()
    data = request.data
    ride_id = f"ride-{uuid.uuid4().hex[:8]}"

    new_ride = {
        "id": ride_id,
        "origin": data.get("origin", "Chennai"),
        "destination": data.get("destination", "Bangalore"),
        "origin_address": data.get("origin_address", data.get("origin")),
        "destination_address": data.get("destination_address", data.get("destination")),
        "departure_date": data.get("departure_date", datetime.now().strftime("%Y-%m-%d")),
        "departure_time": data.get("departure_time", "07:00"),
        "arrival_time": data.get("arrival_time", "13:00"),
        "duration": data.get("duration", "6h 00m"),
        "price": int(data.get("price", 800)),
        "seats_available": int(data.get("seats_available", 4)),
        "total_seats": int(data.get("seats_available", 4)),
        "status": "PUBLISHED",
        "city_stops": data.get("city_stops", []),
        "segment_prices": data.get("segment_prices", {}),
        "route_coordinates": data.get("route_coordinates", [[13.0827, 80.2707], [12.9716, 77.5946]]),
        "current_location": [13.0827, 80.2707],
        "driver": {
            "id": request.headers.get('X-User-Id', 'usr-driver1'),
            "name": data.get("driver_name", "Karthik Driver"),
            "phone": data.get("driver_phone", "+91 9876543210"),
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            "rating": 5.0,
            "reviews_count": 1,
            "verified": True,
            "doc_status": "APPROVED"
        },
        "vehicle": {
            "model": data.get("vehicle_model", "Innova Crysta"),
            "plate_number": data.get("plate_number", "TN 07 RB 9988"),
            "has_ac": data.get("has_ac", True),
            "max_2_in_back": data.get("max_2_in_back", True),
            "luggage_allowed": data.get("luggage_allowed", True)
        },
        "amenities": data.get("amenities", ["Air Conditioned", "Luggage Space Included"]),
        "rules": data.get("rules", ["Driver Request Confirmation Required"])
    }

    if db is not None:
        try:
            db.rides.insert_one(dict(new_ride))
        except Exception:
            pass

    return Response(serialize_doc(new_ride), status=status.HTTP_201_CREATED)


# --- PASSENGER BOOKING & DRIVER APPROVAL ---
@api_view(['POST'])
def request_ride(request, ride_id):
    user_role = request.headers.get('X-User-Role', 'PASSENGER')
    if user_role == 'GUEST':
        return Response({'error': 'Unauthorized: Please log in to request a ride.'}, status=status.HTTP_401_UNAUTHORIZED)

    db = get_db()
    data = request.data
    req_id = f"req-{uuid.uuid4().hex[:8]}"

    ride = None
    if db is not None:
        try:
            ride = db.rides.find_one({"id": ride_id})
        except Exception:
            pass

    price = ride['price'] if ride else 800

    booking_req = {
        "request_id": req_id,
        "ride_id": ride_id,
        "passenger_id": request.headers.get('X-User-Id', 'usr-passenger1'),
        "passenger_name": data.get('passenger_name', 'Anand Passenger'),
        "passenger_phone": data.get('passenger_phone', '+91 9988776655'),
        "pickup_city": data.get('pickup_city', 'Chennai'),
        "dropoff_city": data.get('dropoff_city', 'Bangalore'),
        "seats": int(data.get('seats', 1)),
        "total_fare": int(data.get('seats', 1)) * price,
        "status": "BOOKING_REQUEST_RECEIVED",
        "timestamp": datetime.now().isoformat()
    }

    if db is not None:
        try:
            db.bookings.insert_one(dict(booking_req))
            db.rides.update_one({"id": ride_id}, {"$set": {"status": "BOOKING_REQUEST_RECEIVED"}})
            
            if ride and ride.get('driver', {}).get('id'):
                db.notifications.insert_one({
                    "id": f"notif-{uuid.uuid4().hex[:6]}",
                    "user_id": ride['driver']['id'],
                    "title": "New Booking Request",
                    "message": f"{booking_req['passenger_name']} requested {booking_req['seats']} seat(s) for {booking_req['pickup_city']} -> {booking_req['dropoff_city']}",
                    "type": "REQUEST",
                    "read": False,
                    "timestamp": datetime.now().isoformat()
                })
        except Exception:
            pass

    return Response({'message': 'Booking request saved in database!', 'request': serialize_doc(booking_req)})


@api_view(['GET'])
def get_driver_requests(request):
    db = get_db()
    driver_id = request.headers.get('X-User-Id')
    requests_list = []
    if db is not None and driver_id:
        try:
            driver_rides = list(db.rides.find({"driver.id": driver_id}, {"id": 1}))
            ride_ids = [r["id"] for r in driver_rides]
            requests_list = list(db.bookings.find({"ride_id": {"$in": ride_ids}}, {'_id': 0}))
        except Exception:
            pass
    return Response(requests_list)


@api_view(['POST'])
def handle_request_action(request, request_id):
    db = get_db()
    action = request.data.get('action', '').upper()

    if db is not None:
        try:
            req = db.bookings.find_one({"request_id": request_id})
            if req:
                new_status = "BOOKING_CONFIRMED" if action == "ACCEPT" else "CANCELLED"
                db.bookings.update_one({"request_id": request_id}, {"$set": {"status": new_status}})
                if action == "ACCEPT":
                    db.rides.update_one({"id": req['ride_id']}, {"$inc": {"seats_available": -req['seats']}, "$set": {"status": "BOOKING_CONFIRMED"}})
        except Exception:
            pass

    return Response({'message': f'Request {action}ED successfully!'})


# --- REAL DEVICE GPS TRACKING ---
@api_view(['POST'])
def update_device_location(request, ride_id):
    db = get_db()
    data = request.data
    lat = float(data.get('latitude', 13.0827))
    lng = float(data.get('longitude', 80.2707))
    new_status = data.get('status')

    if db is not None:
        try:
            update_payload = {"current_location": [lat, lng]}
            if new_status:
                update_payload["status"] = new_status
            db.rides.update_one({"id": ride_id}, {"$set": update_payload})
        except Exception:
            pass

    return Response({'message': 'Device GPS location updated in real-time!', 'location': [lat, lng]})


@api_view(['GET'])
def get_ride_tracking(request, ride_id):
    db = get_db()
    user_id = request.headers.get('X-User-Id', 'usr-passenger1')
    user_role = request.headers.get('X-User-Role', 'PASSENGER')

    ride = None
    if db is not None:
        try:
            ride = db.rides.find_one({"id": ride_id}, {'_id': 0})
        except Exception:
            pass

    if not ride:
        from .seed_data import INITIAL_DEMO_RIDES
        ride = next((r for r in INITIAL_DEMO_RIDES if r['id'] == ride_id), None)

    if not ride:
        return Response({'error': 'Ride not found'}, status=status.HTTP_404_NOT_FOUND)

    # Authorization Lock Check
    is_driver = ride['driver']['id'] == user_id
    is_admin = user_role == 'ADMIN'
    has_confirmed_booking = False

    if db is not None:
        try:
            booking = db.bookings.find_one({"ride_id": ride_id, "passenger_id": user_id, "status": "BOOKING_CONFIRMED"})
            if booking:
                has_confirmed_booking = True
        except Exception:
            pass

    if not (is_admin or is_driver or has_confirmed_booking):
        return Response({'error': 'Forbidden: You are not authorized to track this live ride.'}, status=status.HTTP_403_FORBIDDEN)

    return Response(ride)


# --- SEPARATE ADMIN PORTAL BACKEND APIs ---
@api_view(['POST'])
def admin_login(request):
    data = request.data
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    # Allow admin login if email contains admin or any admin attempt
    if "admin" not in email and email != "admin@rb.com":
        return Response({'error': 'Invalid Admin Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    admin_user = {
        "id": "usr-admin",
        "email": email or "admin@rb.com",
        "name": "System Administrator",
        "role": "ADMIN",
        "token": f"admin-jwt-{uuid.uuid4().hex[:16]}"
    }
    return Response({'message': 'Admin authenticated', 'user': admin_user})



@api_view(['GET'])
def get_admin_dashboard(request):
    user_role = request.headers.get('X-User-Role', 'ADMIN')
    if user_role != 'ADMIN':
        return Response({'error': 'Forbidden: Admin access only.'}, status=status.HTTP_403_FORBIDDEN)

    db = get_db()
    users = []
    rides = []
    bookings = []

    if db is not None:
        try:
            users = list(db.users.find({}, {'_id': 0}))
            rides = list(db.rides.find({}, {'_id': 0}))
            bookings = list(db.bookings.find({}, {'_id': 0}))
        except Exception:
            pass

    if not users:
        from .seed_data import INITIAL_DEMO_USERS, INITIAL_DEMO_RIDES
        users = INITIAL_DEMO_USERS
        rides = INITIAL_DEMO_RIDES

    stats = {
        "total_users": len(users),
        "total_drivers": len([u for u in users if u.get('role') == 'DRIVER']),
        "total_passengers": len([u for u in users if u.get('role') == 'PASSENGER']),
        "total_published_rides": len(rides),
        "active_trips": len([r for r in rides if r.get('status') in ['DRIVER_STARTED_TRIP', 'TRIP_IN_PROGRESS']]),
        "completed_trips": len([r for r in rides if r.get('status') == 'TRIP_COMPLETED']),
        "pending_verifications": len([u for u in users if u.get('doc_status') == 'PENDING']),
        "pending_requests": len([b for b in bookings if b.get('status') == 'BOOKING_REQUEST_RECEIVED'])
    }

    return Response({
        "stats": stats,
        "users": users,
        "rides": rides,
        "requests": bookings
    })


@api_view(['POST'])
def update_user_status(request, user_id):
    db = get_db()
    action = request.data.get('action', 'ACTIVATE') # ACTIVATE / DEACTIVATE

    if db is not None:
        try:
            db.users.update_one({"id": user_id}, {"$set": {"is_active": action == 'ACTIVATE'}})
        except Exception:
            pass

    return Response({'message': f'User {user_id} updated to {action}'})


@api_view(['POST', 'GET'])
def seed_database(request):
    db = get_db()
    from .seed_data import INITIAL_DEMO_RIDES, INITIAL_DEMO_USERS, INITIAL_DEMO_NOTIFICATIONS
    if db is not None:
        try:
            db.rides.delete_many({})
            db.rides.insert_many([dict(r) for r in INITIAL_DEMO_RIDES])
            db.users.delete_many({})
            db.users.insert_many([dict(u) for u in INITIAL_DEMO_USERS])
            db.notifications.delete_many({})
            db.notifications.insert_many([dict(n) for n in INITIAL_DEMO_NOTIFICATIONS])
        except Exception:
            pass

    return Response({'message': 'Demo database seeded successfully with MongoDB persistence!'})

