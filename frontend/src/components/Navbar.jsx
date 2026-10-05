import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import NotificationDrawer from './NotificationDrawer';
import { Search } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, requireAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm' : 'bg-white/90 backdrop-blur-sm'}`}>
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded bg-brand-deepblue flex items-center justify-center text-white">
            <span className="font-bold text-lg tracking-tight">RB</span>
          </div>
          <span className="text-xl font-extrabold text-brand-dark tracking-tight">
            Rides
          </span>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-brand-dark/80">
          <Link to="/search" className="hover:text-brand-deepblue transition-colors">Find a ride</Link>
          <Link to="/publish" className="hover:text-brand-deepblue transition-colors">Offer a ride</Link>
          <Link to="/how-it-works" className="hover:text-brand-deepblue transition-colors">How it works</Link>
          <Link to="/safety" className="hover:text-brand-deepblue transition-colors">Safety</Link>
          <Link to="/help" className="hover:text-brand-deepblue transition-colors">Help</Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate('/search')}
            className="text-brand-dark hover:text-brand-deepblue transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <NotificationDrawer user={user} />
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 rounded-full border-2 border-transparent hover:border-brand-lightblue transition-all duration-300 p-0.5"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenAuth}
                  className="hidden sm:block text-sm font-bold text-brand-dark bg-white border border-gray-300 hover:bg-gray-50 px-5 py-2.5 rounded-lg transition-all"
                >
                  Log in
                </button>
                <button
                  onClick={onOpenAuth}
                  className="text-sm font-bold text-white bg-brand-deepblue hover:bg-opacity-90 px-5 py-2.5 rounded-lg transition-all"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
