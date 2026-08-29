import uuid
from datetime import datetime, timedelta

INITIAL_DEMO_RIDES = [
    {
        "id": "ride-101",
        "origin": "Chennai",
        "destination": "Bangalore",
        "origin_address": "Koyambedu Bus Terminus, Chennai",
        "destination_address": "Silk Board Junction, Bangalore",
        "departure_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        "departure_time": "06:30",
        "arrival_time": "12:30",
        "duration": "6h 00m",
        "price": 800,
        "seats_available": 3,
        "total_seats": 4,
        "status": "PUBLISHED", # 11-Stage Pipeline
        "city_stops": [
            {"city": "Chennai", "distance_km": 0},
            {"city": "Vellore", "distance_km": 140},
            {"city": "Bangalore", "distance_km": 345}
        ],
        "segment_prices": {
            "Chennai-Vellore": 300,
            "Vellore-Bangalore": 500,
            "Chennai-Bangalore": 800
        },
        "route_coordinates": [
            [13.0827, 80.2707], # Chennai
            [12.9165, 79.1325], # Vellore
            [12.9716, 77.5946]  # Bangalore
        ],
        "current_location": [13.0827, 80.2707],
        "driver": {
            "id": "driver-1",
            "name": "Karthik Subramanian",
            "rating": 4.9,
            "reviews_count": 52,
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            "phone": "+91 9876543210",
            "verified": True,
            "doc_status": "APPROVED",
            "bio": "Verified driver traveling weekly between Chennai, Vellore & Bangalore."
        },
        "vehicle": {
            "model": "Innova Crysta (White)",
            "plate_number": "TN 07 RB 9988",
            "has_ac": True,
            "max_2_in_back": True,
            "luggage_allowed": True
        }
    },
    {
        "id": "ride-102",
        "origin": "Mumbai",
        "destination": "Pune",
        "origin_address": "Dadar East TT Circle, Mumbai",
        "destination_address": "Swargate Bus Stand, Pune",
        "departure_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        "departure_time": "08:00",
        "arrival_time": "11:15",
        "duration": "3h 15m",
        "price": 400,
        "seats_available": 2,
        "total_seats": 4,
        "status": "DRIVER_STARTED_TRIP",
        "city_stops": [
            {"city": "Mumbai", "distance_km": 0},
            {"city": "Lonavala", "distance_km": 85},
            {"city": "Pune", "distance_km": 150}
        ],
        "segment_prices": {
            "Mumbai-Lonavala": 250,
            "Lonavala-Pune": 180,
            "Mumbai-Pune": 400
        },
        "route_coordinates": [
            [19.0760, 72.8777],
            [18.7557, 73.4091],
            [18.5204, 73.8567]
        ],
        "current_location": [18.7557, 73.4091],
        "driver": {
            "id": "driver-2",
            "name": "Rajesh Kumar",
            "rating": 4.95,
            "reviews_count": 88,
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            "phone": "+91 9811223344",
            "verified": True,
            "doc_status": "APPROVED",
            "bio": "Express commute between Mumbai and Pune."
        },
        "vehicle": {
            "model": "Hyundai Creta (Silver)",
            "plate_number": "MH 12 RB 4589",
            "has_ac": True,
            "max_2_in_back": True,
            "luggage_allowed": True
        }
    }
]

INITIAL_DEMO_USERS = [
    {
        "id": "usr-admin",
        "email": "admin@rb.com",
        "name": "System Admin",
        "phone": "+91 9000000000",
        "role": "ADMIN",
        "verified": True,
        "doc_status": "APPROVED"
    },
    {
        "id": "usr-driver1",
        "email": "driver@rb.com",
        "name": "Karthik Driver",
        "phone": "+91 9876543210",
        "role": "DRIVER",
        "verified": True,
        "doc_status": "APPROVED",
        "license_number": "DL-0420210088",
        "rc_number": "TN-07-RB-9988"
    },
    {
        "id": "usr-passenger1",
        "email": "passenger@rb.com",
        "name": "Anand Passenger",
        "phone": "+91 9988776655",
        "role": "PASSENGER",
        "verified": True
    }
]

INITIAL_DEMO_NOTIFICATIONS = [
    {
        "id": "notif-1",
        "user_id": "usr-driver1",
        "title": "New Booking Request",
        "message": "Anand Passenger requested 1 seat for Vellore -> Bangalore (₹500)",
        "type": "REQUEST",
        "read": False,
        "timestamp": datetime.now().isoformat()
    }
]
