import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationDrawer from './NotificationDrawer';
import { Car, PlusCircle, Search, User, ShieldCheck, Navigation, LogIn, LayoutDashboard, LogOut, Clock } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, requireAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="text-blue-600">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            BlaBlaCar
          </span>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate('/search')}
            className="hidden sm:flex items-center space-x-1.5 text-sm font-semibold text-[#00aff5] hover:text-[#0092cc] transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>

          <button
            onClick={() => {
              if (requireAuth('/publish')) {
                navigate('/publish');
              }
            }}
            className="hidden sm:flex items-center space-x-1.5 text-sm font-semibold text-[#00aff5] border-2 border-[#00aff5] rounded-full px-4 py-2 hover:bg-[#00aff5] hover:text-white transition-colors"
          >
            <span>Offer a ride</span>
          </button>

          <div className="flex items-center space-x-3 pl-2 sm:pl-4 sm:border-l border-slate-200">
            <NotificationDrawer user={user} />
            
            {user ? (
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 rounded-full border border-slate-200 hover:shadow-sm transition-all"
              >
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
