import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Calendar, Users, IndianRupee, LayoutDashboard, Navigation } from 'lucide-react';
import { getUserRideHistory } from '../api';

export default function RideHistory({ user, onRideClick }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getUserRideHistory();
        setHistory(data);
      } catch (e) {
        console.error("Failed to fetch history:", e);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchHistory();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-8">
      <div className="flex items-center space-x-3 mb-8">
        <Clock className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-slate-900">Your Ride History</h1>
      </div>

      {loading ? (
        <div className="text-center pt-28 pb-12 text-slate-500">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="text-center pt-28 pb-12 bg-white rounded-2xl border border-purple-100 shadow-sm">
          <p className="text-slate-500">No past rides found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((ride, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 cursor-pointer hover:border-purple-500 hover:shadow-[0_8px_25px_rgba(124,58,237,0.12)] transition"
              onClick={() => onRideClick && onRideClick(ride.id)}
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>{ride.departure_date}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-900 text-xs font-semibold">
                    {ride.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="font-bold text-lg text-slate-900 flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {ride.is_driver ? ride.price : (ride.total_fare_paid || ride.price)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="flex flex-col items-center space-y-1 mt-1">
                      <div className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-white z-10" />
                      <div className="w-0.5 h-10 bg-purple-200" />
                      <div className="w-3 h-3 rounded-full border-2 border-purple-600 bg-white z-10" />
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="font-bold text-slate-900">{ride.origin}</p>
                        <p className="text-xs text-slate-500">{ride.departure_time}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{ride.destination}</p>
                        <p className="text-xs text-slate-500">{ride.arrival_time}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 bg-purple-50/50 px-3 py-1.5 rounded-lg border border-purple-100">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>
                      {ride.is_driver ? 
                        `${ride.total_seats - ride.seats_available} / ${ride.total_seats} Booked` : 
                        `${ride.booked_seats || 1} Seat(s)`}
                    </span>
                  </div>
                  {!ride.is_driver && ride.booking_status && (
                    <div className="flex flex-col items-end">
                      <div className="text-xs font-semibold text-purple-800 bg-purple-50 px-2 py-1 rounded">
                        Booking: {ride.booking_status?.replace(/_/g, ' ')}
                      </div>
                      {ride.driver?.phone && (
                        <div className="text-[10px] text-slate-500 font-medium mt-1 text-right">
                          Driver Tel: {ride.driver.phone}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Context Actions */}
                  <div className="mt-2 pt-2 border-t border-slate-100 w-full flex justify-end">
                    {ride.is_driver ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/driver/${ride.id}`); }} 
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-bold rounded-lg flex items-center space-x-1.5 text-xs shadow-sm hover:from-purple-800 hover:to-indigo-700 transition"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Driver Console</span>
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/track/${ride.id}`); }} 
                        className="px-3 py-1.5 bg-purple-700 text-white font-bold rounded-lg flex items-center space-x-1.5 text-xs shadow-sm hover:bg-purple-800 transition"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Live Tracking</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
