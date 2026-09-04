import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDriverRequests, handleRequestAction, postDeviceLocation } from '../api';
import { ShieldCheck, Check, X, Navigation, Play, MapPin, Users, Phone, Radio } from 'lucide-react';

export default function DriverDashboard() {
  const { rideId = 'ride-101' } = useParams();
  const [requests, setRequests] = useState([]);
  const [tripStatus, setTripStatus] = useState('PUBLISHED');
  const [gpsActive, setGpsActive] = useState(false);
  const [currentCoords, setCurrentCoords] = useState({ lat: 13.0827, lng: 80.2707 });

  const fetchRequests = async () => {
    try {
      const data = await getDriverRequests();
      setRequests(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  // HTML5 Device GPS Tracking Watcher
  useEffect(() => {
    let watchId;
    if (gpsActive && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentCoords({ lat, lng });
          try {
            await postDeviceLocation(rideId, lat, lng, tripStatus);
          } catch (e) {
            console.error(e);
          }
        },
        (error) => console.warn('Geolocation warning:', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [gpsActive, tripStatus, rideId]);

  const handleStartTrip = async () => {
    setGpsActive(true);
    setTripStatus('DRIVER_STARTED_TRIP');
    try {
      await postDeviceLocation(rideId, currentCoords.lat, currentCoords.lng, 'DRIVER_STARTED_TRIP');
    } catch (e) {
      alert('Trip started locally');
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      await handleRequestAction(requestId, action);
      fetchRequests();
    } catch (e) {
      alert('Action failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase text-cyan-600 mb-1">
            <Radio className={`w-4 h-4 ${gpsActive ? 'text-emerald-500 animate-ping' : ''}`} />
            <span>Driver Real Device GPS Station</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Driver Console</h1>
          <p className="text-xs text-slate-500 mt-1">
            Current GPS: [{currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}] &bull; Status: <strong className="text-cyan-700">{tripStatus}</strong>
          </p>
        </div>

        {!gpsActive ? (
          <button
            onClick={handleStartTrip}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-transform active:scale-95 text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Trip & Broadcast Device GPS</span>
          </button>
        ) : (
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Broadcasting Device GPS Real-Time</span>
          </div>
        )}
      </div>

      {/* Requests & Status Update */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PASSENGER REQUESTS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-600" />
            <span>Passenger Requests ({requests.length})</span>
          </h3>

          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.request_id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{req.passenger_name}</div>
                    <div className="text-xs text-slate-500 mt-1">{req.pickup_city} &rarr; {req.dropoff_city}</div>
                    {req.passenger_phone && (
                      <a href={`tel:${req.passenger_phone}`} className="inline-flex items-center space-x-1 mt-2 text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors">
                        <Phone className="w-3 h-3" />
                        <span>Call Passenger: {req.passenger_phone}</span>
                      </a>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">₹{req.total_fare}</div>
                    <div className="text-xs text-cyan-600 font-bold">{req.seats} Seat(s)</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    req.status === 'BOOKING_CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 
                    req.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {req.status}
                  </span>

                  {req.status === 'BOOKING_REQUEST_RECEIVED' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(req.request_id, 'ACCEPT')}
                        className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" /> <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleAction(req.request_id, 'REJECT')}
                        className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" /> <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GPS LOCATION BROADCAST STATIONS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-cyan-600" />
            <span>Update Stage & Device Location</span>
          </h3>

          <div className="space-y-2">
            {[
              { label: 'DRIVER_STARTED_TRIP', lat: 13.0827, lng: 80.2707 },
              { label: 'DRIVER_APPROACHING_PICKUP', lat: 12.8342, lng: 79.7036 },
              { label: 'PASSENGER_PICKED_UP', lat: 12.8342, lng: 79.7036 },
              { label: 'TRIP_IN_PROGRESS', lat: 12.9165, lng: 79.1325 },
              { label: 'PASSENGER_DROPPED_OFF', lat: 12.9716, lng: 77.5946 },
              { label: 'TRIP_COMPLETED', lat: 12.9716, lng: 77.5946 }
            ].map((stg) => (
              <button
                key={stg.label}
                onClick={async () => {
                  setTripStatus(stg.label);
                  setCurrentCoords({ lat: stg.lat, lng: stg.lng });
                  await postDeviceLocation(rideId, stg.lat, stg.lng, stg.label);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all flex justify-between items-center ${
                  tripStatus === stg.label ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{stg.label}</span>
                <span className="text-[10px] opacity-80">[{stg.lat}, {stg.lng}]</span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
