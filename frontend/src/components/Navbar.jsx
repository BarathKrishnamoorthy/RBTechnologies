import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationDrawer from './NotificationDrawer';
import { Car, PlusCircle, Search, User, ShieldCheck, Navigation, LogIn, LayoutDashboard, LogOut, Clock } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, requireAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">

        {/* Brand Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-slate-900 shadow-md flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
            <Car className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-blue-700">
              RB<span className="text-blue-500">Rides</span>
            </span>
            <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-100 text-blue-700 tracking-wide">
              Carpool
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/search')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              activePage === '/search'
                ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Find Ride</span>
          </button>

          <button
            onClick={() => {
              if (requireAuth('/publish')) {
                navigate('/publish');
              }
            }}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-green-600 text-white font-bold text-xs shadow-md shadow-green-600/25 transition-all duration-300 active:scale-95 hover:bg-green-700 hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Ride</span>
          </button>

          <div className="h-8 w-px bg-slate-200" />

          {/* Notification Drawer */}
          <NotificationDrawer user={user} />
          
          {/* History */}
          {user && (
            <button
              onClick={() => navigate('/history')}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                activePage === '/history'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>History</span>
            </button>
          )}

          {/* Real User Auth Button */}
          {user ? (
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 p-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all duration-300"
            >
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
              />
              <span className="hidden sm:inline text-xs font-bold text-blue-700 pr-2">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/25 transition-all duration-300 active:scale-95 hover:bg-sky-600"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign Up / Log In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
