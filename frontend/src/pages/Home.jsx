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

          {/* Premium Search Bar Card - Redesigned */}
          <div className="mt-12 max-w-5xl mx-auto">
            {/* Glassmorphism Card */}
            <div className="relative group">
              {/* Animated gradient background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse" />
              
              {/* Main card content */}
              <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
                
                <form onSubmit={handleSearchSubmit} className="space-y-4 sm:space-y-0">
                  
                  {/* Desktop Grid Layout */}
                  <div className="hidden sm:grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                    
                    {/* Origin - 2.5 cols */}
                    <div className="lg:col-span-3 group/input">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Leaving from</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin className="w-5 h-5 text-cyan-600 group-focus-within/input:scale-110 transition-transform" />
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Chennai"
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                        />
                      </div>
                    </div>

                    {/* Swap Icon */}
                    <div className="lg:col-span-1 flex justify-center items-end pb-0.5">
                      <button type="button" className="p-3 bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-full hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-md">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m0 0l4 4m10-4v12m0 0l4-4m0 0l-4-4" />
                        </svg>
                      </button>
                    </div>

                    {/* Destination - 2.5 cols */}
                    <div className="lg:col-span-3 group/input">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Going to</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin className="w-5 h-5 text-cyan-600 group-focus-within/input:scale-110 transition-transform" />
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Bangalore"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                        />
                      </div>
                    </div>

                    {/* Date - 2 cols with extra padding */}
                    <div className="lg:col-span-2 group/input">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">When</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Calendar className="w-5 h-5 text-cyan-600 group-focus-within/input:scale-110 transition-transform" />
                        </div>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                        />
                      </div>
                    </div>

                    {/* Passengers - 1.5 cols */}
                    <div className="lg:col-span-2 group/input">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Seats</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Users className="w-5 h-5 text-cyan-600 group-focus-within/input:scale-110 transition-transform" />
                        </div>
                        <select
                          value={seats}
                          onChange={(e) => setSeats(Number(e.target.value))}
                          className="w-full pl-12 pr-10 py-3.5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md appearance-none cursor-pointer"
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
                        {/* Dropdown arrow */}
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                        </div>
                      </div>
                    </div>

                    {/* Search Button - 1 col */}
                    <button
                      type="submit"
                      className="lg:col-span-1 h-[52px] bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-700 hover:via-blue-700 hover:to-cyan-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-cyan-600/40 hover:shadow-2xl flex items-center justify-center px-4 transition-all duration-300 active:scale-95 hover:scale-105 relative overflow-hidden group/btn"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-20 translate-x-full group-hover/btn:translate-x-0 transition-all duration-500" />
                      <Search className="w-5 h-5" />
                    </button>

                  </div>

                  {/* Mobile Layout */}
                  <div className="sm:hidden space-y-3">
                    
                    {/* Origin */}
                    <div className="group/input">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Leaving from</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin className="w-5 h-5 text-cyan-600" />
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Chennai"
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="group/input">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Going to</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin className="w-5 h-5 text-cyan-600" />
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Bangalore"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Date & Seats Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="group/input">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">When</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Calendar className="w-4 h-4 text-cyan-600" />
                          </div>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="group/input">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Seats</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Users className="w-4 h-4 text-cyan-600" />
                          </div>
                          <select
                            value={seats}
                            onChange={(e) => setSeats(Number(e.target.value))}
                            className="w-full pl-10 pr-3 py-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200/50 focus:bg-white transition-all appearance-none cursor-pointer"
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
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Search Button */}
                    <button
                      type="submit"
                      className="w-full h-[48px] bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-700 hover:via-blue-700 hover:to-cyan-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-cyan-600/40 flex items-center justify-center space-x-2 transition-all active:scale-95 relative overflow-hidden group/btn mt-2"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-20 translate-x-full group-hover/btn:translate-x-0 transition-all duration-500" />
                      <Search className="w-5 h-5" />
                      <span>Search</span>
                    </button>

                  </div>

                </form>

              </div>
            </div>
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

      {/* More about CarMate / Carpool */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Why CarMate</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Smarter rides for everyday travel</h2>
          <p className="mt-4 text-slate-600 text-base">
            CarMate helps commuters share seats, save money, and travel with trusted people on the same route.
            It is built for real-world road trips, office commutes, and weekend journeys across cities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Shared cost, less stress</h3>
            <p className="mt-3 text-sm text-slate-600">
              Split travel expenses with fellow riders and reduce the cost of fuel, tolls, and parking while keeping every trip more affordable.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Trusted and verified</h3>
            <p className="mt-3 text-sm text-slate-600">
              Every ride is built around verified drivers, transparent profiles, and a safer community experience for passengers and car owners alike.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Better for the road</h3>
            <p className="mt-3 text-sm text-slate-600">
              Fewer empty seats means less traffic, lower emissions, and a smarter way to travel together without sacrificing comfort or convenience.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] bg-slate-900 p-6 md:p-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-8 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">How it works</p>
              <h3 className="mt-3 text-3xl font-extrabold">Travel together with confidence</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Search a route', text: 'Choose your origin, destination, and travel date.' },
                { step: '2', title: 'Match with a driver', text: 'Browse verified carpool options and available seats.' },
                { step: '3', title: 'Ride together', text: 'Book your seat and enjoy a smoother, affordable trip.' },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-bold text-cyan-300">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-bold text-white">{item.title}</h4>
                  <p className="mt-2 text-sm text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
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
