import React, { useState, useEffect } from 'react';
import { getProtectedRideTracking } from '../api';
import { Navigation, MapPin, ShieldCheck, Phone, CheckCircle2, Clock, Zap, Car, Lock, AlertTriangle } from 'lucide-react';

export default function LiveTripTracker({ rideId = 'ride-101', user }) {
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchProtectedTracking = async () => {
    try {
      const data = await getProtectedRideTracking(rideId);
      setRide(data);
      setAuthError(null);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setAuthError('Forbidden: Access Denied. You can only track live GPS for rides where your booking is confirmed or if you are the driver/admin.');
      } else {
        setAuthError('Unable to load live tracking.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtectedTracking();
    const timer = setInterval(fetchProtectedTracking, 3000);
    return () => clearInterval(timer);
  }, [rideId, user]);

  const stages = [
    { key: 'DRAFT', label: 'Draft' },
    { key: 'PUBLISHED', label: 'Published' },
    { key: 'BOOKING_REQUEST_RECEIVED', label: 'Request Received' },
    { key: 'BOOKING_CONFIRMED', label: 'Booking Confirmed' },
    { key: 'DRIVER_STARTED_TRIP', label: 'Driver Started Trip' },
    { key: 'DRIVER_APPROACHING_PICKUP', label: 'Approaching Pickup' },
    { key: 'PASSENGER_PICKED_UP', label: 'Passenger Picked Up' },
    { key: 'TRIP_IN_PROGRESS', label: 'Trip In Progress' },
    { key: 'PASSENGER_DROPPED_OFF', label: 'Dropped Off' },
    { key: 'TRIP_COMPLETED', label: 'Trip Completed' }
  ];

  if (loading) return <div className="p-12 text-center text-slate-500">Authenticating Protected Live Tracking Access...</div>;

  if (authError) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-amber-50 border-2 border-amber-300 rounded-3xl text-center space-y-4 shadow-lg">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Protected Live Tracking Lock</h2>
        <p className="text-sm text-slate-700 leading-relaxed max-w-md mx-auto">{authError}</p>
        <div className="p-4 bg-white rounded-2xl border border-amber-200 text-xs text-slate-500">
          Core Access Rule: Passenger A confirmed on Ride #101 can track Ride #101, but cannot track Ride #102.
        </div>
      </div>
    );
  }

  const currentStageIndex = stages.findIndex((s) => s.key === ride.status);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 1;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Live Header Status */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Protected Authorized Live GPS Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{ride.origin} &rarr; {ride.destination}</h1>
          <p className="text-xs text-slate-300 mt-1">Driver: {ride.driver.name} ({ride.vehicle.model})</p>
        </div>

        <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-2xl text-cyan-300 text-sm font-bold">
          Stage: {stages[activeIndex]?.label}
        </div>
      </div>

      {/* 11-Stage Progress Stepper Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">11-Stage Trip Status Lifecycle</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5">
          {stages.map((stg, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={stg.key} className="text-center space-y-1">
                <div className={`h-2 rounded-full transition-all ${
                  isCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-cyan-600 animate-pulse' : 'bg-slate-200'
                }`} />
                <span className={`block text-[9px] font-bold ${
                  isCurrent ? 'text-cyan-600' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  {stg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Map Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Map Display Box */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 h-96 flex flex-col justify-between text-white relative overflow-hidden border border-slate-800 shadow-xl">
          <div className="flex justify-between items-center z-10">
            <span className="text-xs font-bold px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30 flex items-center space-x-1">
              <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Real-Time GPS Location Stream</span>
            </span>
            <span className="text-xs text-slate-400 font-bold">{ride.vehicle.plate_number}</span>
          </div>

          <div className="text-center space-y-2 z-10">
            <div className="w-16 h-16 bg-cyan-600/30 border-2 border-cyan-400 text-cyan-300 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/30 animate-bounce">
              <Car className="w-8 h-8" />
            </div>
            <div className="text-xl font-black">Driver is near: {ride.origin}</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Live GPS coordinates: [{ride.current_location ? ride.current_location.join(', ') : '13.0827, 80.2707'}]
            </p>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 z-10 border-t border-slate-800 pt-3">
            <span>Pickup: {ride.origin}</span>
            <span>Destination: {ride.destination}</span>
          </div>
        </div>

        {/* Driver Details Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={ride.driver.avatar}
              alt={ride.driver.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-cyan-600 shadow"
            />
            <div>
              <div className="font-bold text-slate-900 text-base">{ride.driver.name}</div>
              <div className="text-xs text-slate-500">{ride.vehicle.model}</div>
              <div className="text-xs text-emerald-600 font-bold flex items-center space-x-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Driver</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">ETA to Pickup:</span>
              <span className="font-bold text-cyan-700">12 Mins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Driver Contact:</span>
              <span className="font-bold text-slate-900">{ride.driver.phone}</span>
            </div>
          </div>

          <a
            href={`tel:${ride.driver.phone}`}
            className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2 text-xs shadow"
          >
            <Phone className="w-4 h-4" />
            <span>Call Driver Now</span>
          </a>
        </div>

      </div>

    </div>
  );
}
