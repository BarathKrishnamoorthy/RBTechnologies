import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../api';
import { Bell, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationDrawer({ user }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const data = await getNotifications(user.id);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 4000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-slate-100 relative text-slate-600 hover:text-slate-900 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Bell className="w-4 h-4 text-cyan-600" />
              <span>Notifications Feed</span>
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">No new notifications.</div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => {
                    if (n.ride_id) {
                      navigate(`/track/${n.ride_id}`);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 ${n.ride_id ? 'cursor-pointer hover:bg-slate-100 hover:border-slate-200 transition-colors' : ''}`}
                >
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{n.title}</span>
                  </div>
                  <p className="text-xs text-slate-600">{n.message}</p>
                  <span className="block text-[10px] text-slate-400 text-right">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
