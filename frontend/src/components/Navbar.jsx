import React, { useState } from 'react';
import NotificationDrawer from './NotificationDrawer';
import { Car, PlusCircle, Search, User, ShieldCheck, Navigation, LogIn, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, user, onOpenAuth }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              RB<span className="text-cyan-600">Rides</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-full border border-cyan-200">
              Carpool
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => setActivePage('search')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
              activePage === 'search' ? 'text-cyan-600 bg-cyan-50' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Find Ride</span>
          </button>

          <button
            onClick={() => setActivePage('publish')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Ride</span>
          </button>

          <button
            onClick={() => setActivePage('driver_dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
              activePage === 'driver_dashboard' ? 'text-cyan-600 bg-cyan-50' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Driver Console</span>
          </button>

          <button
            onClick={() => setActivePage('tracking')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
              activePage === 'tracking' ? 'text-cyan-600 bg-cyan-50' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Navigation className="w-4 h-4 text-cyan-600" />
            <span className="hidden sm:inline">Live Tracking</span>
          </button>

          <div className="h-6 w-px bg-slate-200" />

          {/* Notification Drawer */}
          <NotificationDrawer user={user} />

          {/* Real User Auth Button */}
          {user ? (
            <button 
              onClick={() => setActivePage('profile')}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <img src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              <span className="hidden sm:inline text-xs font-bold text-slate-800 pr-2">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-transform active:scale-95"
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
