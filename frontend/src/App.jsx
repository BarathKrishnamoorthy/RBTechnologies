import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchRides from './pages/SearchRides';
import PublishRideWizard from './pages/PublishRideWizard';
import RideDetail from './pages/RideDetail';
import DriverDashboard from './pages/DriverDashboard';
import LiveTripTracker from './pages/LiveTripTracker';
import AuthModal from './pages/AuthModal';
import { requestRide, setAuthHeaders } from './api';
import { Car, ShieldCheck } from 'lucide-react';

export default function App() {
  // Restore page from localStorage on load (so refresh keeps same page)
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('rb_active_page') || 'home';
  });
  const [searchParams, setSearchParams] = useState({ origin: '', destination: '', date: '', seats: 1 });
  const [selectedRideId, setSelectedRideId] = useState(() => {
    return localStorage.getItem('rb_selected_ride') || 'ride-101';
  });

  // Restore user session from localStorage on load
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rb_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('rb_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rb_user');
    }
    setAuthHeaders(user);
  }, [user]);

  // Persist active page to localStorage (skip auth-only pages)
  useEffect(() => {
    const publicPages = ['home', 'search', 'detail'];
    if (publicPages.includes(activePage) || user) {
      localStorage.setItem('rb_active_page', activePage);
    }
  }, [activePage, user]);

  // Persist selected ride
  useEffect(() => {
    if (selectedRideId) {
      localStorage.setItem('rb_selected_ride', selectedRideId);
    }
  }, [selectedRideId]);

  const handleHeroSearch = (params) => {
    setSearchParams(params);
    setActivePage('search');
  };

  // Unauthenticated Guest Gatekeeper
  const handleSelectRide = (rideId) => {
    if (!user) {
      setSelectedRideId(rideId);
      setAuthModalOpen(true); // Redirect unauthenticated guest to Log In modal
      return;
    }
    setSelectedRideId(rideId);
    setActivePage('detail');
  };

  const handlePublishSuccess = (rideId) => {
    setSelectedRideId(rideId);
    setActivePage('detail');
  };

  const handleRequestRideSubmit = async (rideId, pickupCity, dropoffCity, seats) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    try {
      await requestRide(rideId, {
        passenger_name: user.name,
        passenger_phone: user.phone || '+91 9988776655',
        pickup_city: pickupCity,
        dropoff_city: dropoffCity,
        seats
      });
      setActivePage('tracking');
    } catch (e) {
      alert('Request failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={(page) => {
          if ((page === 'publish' || page === 'driver_dashboard' || page === 'tracking') && !user) {
            setAuthModalOpen(true); // Redirect to Login modal when clicking protected actions
            return;
          }
          setActivePage(page);
        }} 
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main App Content View Switcher */}
      <main className="flex-1">
        {activePage === 'home' && (
          <Home onSearch={handleHeroSearch} />
        )}

        {/* Public Search Works Without Login */}
        {activePage === 'search' && (
          <SearchRides initialParams={searchParams} onSelectRide={handleSelectRide} />
        )}

        {activePage === 'publish' && user && (
          <PublishRideWizard onPublishSuccess={handlePublishSuccess} user={user} />
        )}

        {activePage === 'detail' && (
          <RideDetail 
            rideId={selectedRideId} 
            onBack={() => setActivePage('search')}
            onRequestRide={handleRequestRideSubmit}
            user={user}
          />
        )}

        {activePage === 'driver_dashboard' && user && (
          <DriverDashboard rideId={selectedRideId} />
        )}

        {activePage === 'tracking' && (
          <LiveTripTracker rideId={selectedRideId} user={user} />
        )}

        {activePage === 'profile' && user && (
          <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-4">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-cyan-600 mx-auto shadow-lg"
              />
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                {user.email} &bull; Phone: {user.phone || '+91 9876543210'}
              </p>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-bold max-w-md mx-auto flex items-center justify-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Account Logged In</span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-center">
                <button
                  onClick={() => {
                    setUser(null);
                    localStorage.removeItem('rb_user');
                    localStorage.removeItem('rb_active_page');
                    setActivePage('home');
                  }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                  Sign Out Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Auth Login Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(loggedUser) => {
          setUser(loggedUser);
          setActivePage('home'); // Navigate to home page after successful login
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-extrabold text-lg">
              <Car className="w-5 h-5 text-cyan-400" />
              <span>RB Rides</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Public Carpooling Platform. Anyone can browse published rides. Clicking any ride prompts Sign In / Registration.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Top Intercity Routes</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-cyan-400 cursor-pointer" onClick={() => handleHeroSearch({ origin: 'Chennai', destination: 'Bangalore' })}>Chennai &rarr; Vellore &rarr; Bangalore</li>
              <li className="hover:text-cyan-400 cursor-pointer" onClick={() => handleHeroSearch({ origin: 'Mumbai', destination: 'Pune' })}>Mumbai &rarr; Lonavala &rarr; Pune</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Platform Features</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-200">Public Ride Search</li>
              <li className="hover:text-slate-200">Protected Booking & Detail Access</li>
              <li className="hover:text-slate-200">HTML5 Device GPS Tracking</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-cyan-400">React.js</span>
              <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-blue-400">Django REST</span>
              <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-emerald-400">MongoDB</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} RB Rides Company. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
