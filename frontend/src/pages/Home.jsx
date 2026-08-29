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
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white pt-16 pb-28 px-4 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
            <Zap className="w-4 h-4" />
            <span>RB Company CarMate & Ride Sharing Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Your pick of rides at <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">low prices</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Travel anywhere with verified drivers. Carpool with thousands of members across top routes.
          </p>

          {/* BlaBlaCar Style Search Bar Card */}
          <div className="mt-8 bg-white rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-900 max-w-4xl mx-auto border border-slate-100">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">

              {/* Origin */}
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-200 transition-all">
                <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Leaving from</label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-200 transition-all">
                <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Going to</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Date & Passengers */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Calendar className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Users className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                  <select
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value={1}>1 seat</option>
                    <option value={2}>2 seats</option>
                    <option value={3}>3 seats</option>
                    <option value={4}>4 seats</option>
                    <option value={5}>5 seats</option>
                    <option value={6}>6 seats</option>
                    <option value={7}>7 seats</option>
                    <option value={8}>8 seats</option>
                    <option value={9}>9 seats</option>
                    <option value={10}>10 seats</option>
                    <option value={11}>11 seats</option>
                    <option value={12}>12 seats</option>
                    <option value={13}>13 seats</option>
                    <option value={14}>14 seats</option>
                    <option value={15}>15 seats</option>
                    <option value={16}>16 seats</option>
                    <option value={17}>17 seats</option>
                    <option value={18}>18 seats</option>
                    <option value={19}>19 seats</option>
                    <option value={20}>20 seats</option>
                    <option value={21}>21 seats</option>
                    <option value={22}>22 seats</option>
                    <option value={23}>23 seats</option>
                    <option value={24}>24 seats</option>
                    <option value={25}>25 seats</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full h-full min-h-[52px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-base rounded-xl shadow-lg shadow-cyan-600/30 flex items-center justify-center space-x-2 transition-transform active:scale-95"
              >
                <Search className="w-5 h-5" />
                <span>Search Rides</span>
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Verified Driver Profiles</h3>
            <p className="mt-2 text-sm text-slate-600">
              We verify phone numbers, government IDs, and driver reviews so you know who you are traveling with.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Instant Seat Booking</h3>
            <p className="mt-2 text-sm text-slate-600">
              Book your ride in seconds. Pay securely online or directly to the driver with zero hidden fees.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Save Fuel & Environment</h3>
            <p className="mt-2 text-sm text-slate-600">
              Share empty car seats to lower travel costs, reduce traffic congestion, and lower carbon emissions.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Carpool Routes */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Popular Carpool Routes</h2>
            <p className="text-sm text-slate-500">Top intercity rides offered by RB community members</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRoutes.map((route, i) => (
            <div
              key={i}
              onClick={() => onSearch({ origin: route.from, destination: route.to })}
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-cyan-500 shadow-sm hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                <span>{route.from}</span>
                <ChevronRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-1 transition-transform" />
                <span>{route.to}</span>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                <span>From <strong className="text-slate-900 text-sm">{route.price}</strong></span>
                <span className="px-2 py-0.5 bg-slate-100 rounded-md font-medium">{route.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
