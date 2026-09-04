import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchRides from './pages/SearchRides';
import PublishRideWizard from './pages/PublishRideWizard';
import RideDetail from './pages/RideDetail';
import DriverDashboard from './pages/DriverDashboard';
import LiveTripTracker from './pages/LiveTripTracker';
import RideHistory from './pages/RideHistory';
import AuthModal from './pages/AuthModal';
import { requestRide, setAuthHeaders } from './api';
import { Car, ShieldCheck } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  // Restore user session from localStorage on load
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rb_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('rb_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rb_user');
    }
    setAuthHeaders(user);
  }, [user]);

  // Protected Route logic for Navbar / actions
  const requireAuth = (path) => {
    if (!user) {
      setPendingRoute(path);
      setAuthModalOpen(true);
      return false;
    }
    return true;
  };

  const handleHeroSearch = (params) => {
    const query = new URLSearchParams(params).toString();
    navigate(`/search?${query}`);
  };

  const handleSelectRide = (rideId) => {
    if (!user) {
      setPendingRoute(`/ride/${rideId}`);
      setAuthModalOpen(true); // Redirect unauthenticated guest to Log In modal
      return;
    }
    navigate(`/ride/${rideId}`);
  };

  const handlePublishSuccess = (rideId) => {
    navigate(`/driver/${rideId}`);
  };

  const handleRequestRideSubmit = async (rideId, pickupCity, dropoffCity, seats) => {
    if (!user) {
      setPendingRoute(`/track/${rideId}`);
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
      navigate(`/track/${rideId}`);
    } catch (e) {
      alert('Request failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header Navbar */}
      <Navbar 
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        requireAuth={requireAuth}
      />

      {/* Main App Content View Switcher */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onSearch={handleHeroSearch} />} />
          <Route path="/search" element={<SearchRides onSelectRide={handleSelectRide} />} />
          <Route path="/publish" element={user ? <PublishRideWizard onPublishSuccess={handlePublishSuccess} user={user} /> : <div className="p-8 text-center">Please log in to publish a ride.</div>} />
          <Route path="/ride/:rideId" element={<RideDetail onBack={() => navigate('/search')} onRequestRide={handleRequestRideSubmit} user={user} />} />
          <Route path="/driver/:rideId" element={user ? <DriverDashboard /> : <div className="p-8 text-center">Please log in.</div>} />
          <Route path="/track/:rideId" element={<LiveTripTracker user={user} />} />
          <Route path="/history" element={user ? <RideHistory user={user} onRideClick={handleSelectRide} /> : <div className="p-8 text-center">Please log in.</div>} />
          
          <Route path="/profile" element={user ? (
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
                      navigate('/');
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-colors"
                  >
                    Sign Out Account
                  </button>
                </div>
              </div>
            </div>
          ) : <div className="p-8 text-center">Please log in.</div>} />
        </Routes>
      </main>

      {/* Auth Login Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(loggedUser) => {
          setUser(loggedUser);
          if (pendingRoute) {
            navigate(pendingRoute);
            setPendingRoute(null);
          }
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
