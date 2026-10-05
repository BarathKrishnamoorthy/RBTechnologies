import React, { useState } from 'react';
import { MapPin, Calendar, Users, Search, ShieldCheck, Zap, HeartHandshake, ChevronRight, Star } from 'lucide-react';

export default function Home({ onSearch }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ origin, destination, date, seats });
  };

  const popularRoutes = [
    { from: 'Mumbai', to: 'Pune', price: '₹400', time: '3h 15m', rides: '14+ rides daily' },
    { from: 'Delhi', to: 'Jaipur', price: '₹650', time: '4h 30m', rides: '20+ rides daily' },
    { from: 'Bangalore', to: 'Chennai', price: '₹750', time: '5h 45m', rides: '10+ rides daily' },
    { from: 'Hyderabad', to: 'Vijayawada', price: '₹550', time: '4h 10m', rides: '12+ rides daily' },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero Text */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#054652] leading-tight tracking-tight">
              Travel anywhere <br className="hidden sm:block" />
              together. Spend smarter.
            </h1>
          </div>
          
          {/* Hero Image */}
          <div className="lg:w-1/2 w-full">
            <img 
              src="https://images.unsplash.com/photo-1546850239-ceb8c4c735d4?auto=format&fit=crop&q=80&w=1600" 
              alt="Friends traveling together" 
              className="rounded-3xl w-full object-cover h-[300px] sm:h-[400px] shadow-lg"
            />
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="relative -mt-10 sm:-mt-16 z-10 max-w-5xl mx-auto">
          <form 
            onSubmit={handleSearchSubmit} 
            className="bg-white rounded-2xl shadow-[0_4px_12px_rgb(0,0,0,0.08)] flex flex-col sm:flex-row items-center border-2 border-[#00aff5] overflow-hidden"
          >
            {/* Leaving from */}
            <div className="w-full sm:flex-1 sm:border-r border-gray-300 px-5 py-2.5 bg-white group hover:bg-gray-50 transition-colors cursor-text">
              <label className="block text-[11px] text-gray-500 font-bold mb-0.5 uppercase tracking-wide">From</label>
              <input
                type="text"
                placeholder="City or place"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full text-sm sm:text-base font-semibold text-[#054652] placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>

            {/* Going to */}
            <div className="w-full sm:flex-1 sm:border-r border-gray-300 px-5 py-2.5 bg-white group hover:bg-gray-50 transition-colors cursor-text">
              <label className="block text-[11px] text-gray-500 font-bold mb-0.5 uppercase tracking-wide">To</label>
              <input
                type="text"
                placeholder="City or place"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-sm sm:text-base font-semibold text-[#054652] placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>

            {/* Date */}
            <div className="w-full sm:flex-1 sm:border-r border-gray-300 px-5 py-2.5 bg-white group hover:bg-gray-50 transition-colors cursor-text">
              <label className="block text-[11px] text-gray-500 font-bold mb-0.5 uppercase tracking-wide">Departure</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm sm:text-base font-semibold text-[#054652] focus:outline-none bg-transparent"
              />
            </div>

            {/* Passengers */}
            <div className="w-full sm:flex-1 px-5 py-2.5 bg-white group hover:bg-gray-50 transition-colors cursor-pointer relative">
              <label className="block text-[11px] text-gray-500 font-bold mb-0.5 uppercase tracking-wide">Passengers</label>
              <select
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full text-sm sm:text-base font-semibold text-[#054652] focus:outline-none bg-transparent appearance-none cursor-pointer"
              >
                {[...Array(8)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1} passenger{i > 0 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full sm:w-[140px] h-full min-h-[64px] bg-[#00aff5] hover:bg-[#0092cc] text-white font-bold text-base transition-colors flex items-center justify-center m-0 border-0"
            >
              Search
            </button>
          </form>
          
          <div className="mt-4 ml-6 flex items-center space-x-2">
            <input type="checkbox" id="showStays" className="w-4 h-4 text-[#00aff5] rounded border-gray-300 focus:ring-[#00aff5]" defaultChecked />
            <label htmlFor="showStays" className="text-sm font-bold text-[#054652]">Show stays</label>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div>
            <div className="mb-4 text-[#708c91]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#054652] mb-3">Travel everywhere</h3>
            <p className="text-[#708c91] text-base leading-relaxed">
              Explore all over India with countless carpool rides.
            </p>
          </div>

          {/* Feature 2 */}
          <div>
            <div className="mb-4 text-[#708c91]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <line x1="4" y1="12" x2="20" y2="12"></line>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#054652] mb-3">Prices like nowhere</h3>
            <p className="text-[#708c91] text-base leading-relaxed">
              Benefit from great-value shared costs on your carpool rides.
            </p>
          </div>

          {/* Feature 3 */}
          <div>
            <div className="mb-4 text-[#708c91]">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#054652] mb-3">Ride with confidence</h3>
            <p className="text-[#708c91] text-base leading-relaxed">
              Feel secure, knowing you're riding with carpool members with Verified Profiles.
            </p>
          </div>
        </div>
      </section>

      {/* Top Rides Section */}
      <section className="bg-[#054652] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Top carpool rides</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.slice(0, 3).map((route, i) => (
              <div 
                key={i}
                onClick={() => onSearch({ origin: route.from, destination: route.to })}
                className="bg-white rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:-translate-y-1 transition-transform shadow-sm"
              >
                <div className="text-[#054652] font-bold text-lg">
                  {route.from} <span className="mx-2 text-gray-400">→</span> {route.to}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
