import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getProtectedRideTracking } from '../api';
import { Navigation, MapPin, ShieldCheck, Phone, CheckCircle2, Clock, Zap, Car, Lock, AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Define a custom car icon using SVG
const carIconHtml = `
  <div style="background-color: #0891b2; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 0 15px rgba(8, 145, 178, 0.5);">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/>
      <path d="M9 17h6"/>
      <circle cx="17" cy="17" r="2"/>
    </svg>
  </div>
`;

const carCustomIcon = L.divIcon({
  html: carIconHtml,
  className: '', // remove default leaflet background styling
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

export default function LiveTripTracker({ user }) {
  const { rideId = 'ride-101' } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const leafletMarker = useRef(null);

  useEffect(() => {
    if (ride && mapRef.current && !leafletMap.current) {
      const center = ride.current_location || [13.0827, 80.2707];
      leafletMap.current = L.map(mapRef.current).setView(center, 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMap.current);
    }
  }, [ride]);

  useEffect(() => {
    if (ride && ride.current_location && leafletMap.current) {
      const [newLat, newLng] = ride.current_location;
      
      if (!leafletMarker.current) {
        leafletMarker.current = L.marker([newLat, newLng], { icon: carCustomIcon }).addTo(leafletMap.current);
        leafletMarker.current.bindPopup(`
          <div class="text-center font-sans">
            <div class="font-bold text-slate-800">${ride.driver.name} is here</div>
            <div class="text-xs text-slate-500">${ride.vehicle.model}</div>
          </div>
        `);
        // Initial flyTo when marker is first placed
        leafletMap.current.flyTo([newLat, newLng], leafletMap.current.getZoom(), { animate: true, duration: 1.5 });
      } else {
        const currentLatLng = leafletMarker.current.getLatLng();
        
        // Only animate if the location actually changed (avoid shaking from 3-second polling)
        if (currentLatLng.lat !== newLat || currentLatLng.lng !== newLng) {
          leafletMarker.current.setLatLng([newLat, newLng]);
          leafletMap.current.flyTo([newLat, newLng], leafletMap.current.getZoom(), { animate: true, duration: 1.5 });
        }
      }
    }
  }, [ride]);

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
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-2 h-96 relative overflow-hidden border border-slate-800 shadow-xl z-0">
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
            <span className="text-xs font-bold px-3 py-1 bg-cyan-500/90 text-white rounded-full shadow-lg flex items-center space-x-1 backdrop-blur-sm pointer-events-auto">
              <Navigation className="w-3.5 h-3.5 animate-spin" />
              <span>Real-Time GPS Stream</span>
            </span>
            <span className="text-xs text-white font-bold px-3 py-1 bg-slate-900/80 rounded-full shadow-lg backdrop-blur-sm pointer-events-auto">{ride.vehicle.plate_number}</span>
          </div>

          <div ref={mapRef} className="w-full h-full rounded-2xl z-0" />
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
