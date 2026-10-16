import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import NotificationDrawer from './NotificationDrawer';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, requireAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm border-b border-purple-100/60' : 'bg-white/90 backdrop-blur-md border-b border-purple-100/40'}`}>
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-700 hover:text-purple-700 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/25 group-hover:scale-105 transition-transform">
              <span className="font-black text-lg tracking-tight">RB</span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              Rides
            </span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden lg:flex items-center space-x-7 text-sm font-bold text-slate-600">
          <Link to="/search" className="hover:text-purple-700 transition-colors">Find a ride</Link>
          <Link to="/publish" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-extrabold text-xs transition-colors border border-purple-200 shadow-xs">
            <span>+</span> Offer a ride
          </Link>
          <Link to="/how-it-works" className="hover:text-purple-700 transition-colors">How it works</Link>
          <Link to="/safety" className="hover:text-purple-700 transition-colors">Safety</Link>
          <Link to="/help" className="hover:text-purple-700 transition-colors">Help</Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate('/search')}
            className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <NotificationDrawer user={user} />
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 rounded-full border-2 border-transparent hover:border-purple-600 transition-all duration-300 p-0.5 cursor-pointer"
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
                  className="hidden sm:block text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-purple-50 hover:text-purple-800 px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-purple-200"
                >
                  Log in
                </button>
                <button
                  onClick={onOpenAuth}
                  className="text-xs font-black text-white bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 px-5 py-2.5 rounded-xl shadow-md shadow-purple-600/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute top-0 left-0 w-72 h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-purple-100">
              <span className="font-extrabold text-slate-900 text-lg">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-purple-700 bg-purple-50 p-2 rounded-full cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col py-6 px-6 space-y-6 flex-1 overflow-y-auto">
              <Link to="/search" className="text-slate-800 font-bold hover:text-purple-700 text-lg">Find a ride</Link>
              <Link to="/publish" className="text-slate-800 font-bold hover:text-purple-700 text-lg">Offer a ride</Link>
              <Link to="/how-it-works" className="text-slate-800 font-bold hover:text-purple-700 text-lg">How it works</Link>
              <Link to="/safety" className="text-slate-800 font-bold hover:text-purple-700 text-lg">Safety</Link>
              <Link to="/help" className="text-slate-800 font-bold hover:text-purple-700 text-lg">Help</Link>
              
              {!user && (
                <div className="pt-6 border-t border-purple-100 space-y-4">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                    className="w-full text-center text-slate-800 font-bold py-3 border border-purple-200 rounded-xl hover:bg-purple-50"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                    className="w-full text-center text-white bg-gradient-to-r from-purple-700 to-indigo-600 font-bold py-3 rounded-xl shadow-md shadow-purple-600/25"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
