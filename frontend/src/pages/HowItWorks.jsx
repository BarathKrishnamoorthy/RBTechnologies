import React from 'react';
import { Search, CalendarCheck, Map, Car, Users, IndianRupee, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="relative min-h-screen bg-[#FAF9FF] text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-900 pt-28 pb-20 overflow-x-hidden">
      
      {/* Dynamic Purple Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-b from-purple-200/50 via-violet-100/30 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-purple-100/60 blur-[110px] rounded-full" />
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-indigo-100/50 blur-[120px] rounded-full" />
        
        {/* Crisp Dot Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotPatternHow" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#8B5CF6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPatternHow)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs sm:text-sm font-semibold shadow-sm mb-2">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <span>Simple, Transparent &amp; Safe Travel</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            How <span className="bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 bg-clip-text text-transparent">RB Rides</span> Works
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Whether you want to save up to 70% by booking empty car seats, or you're driving and want to recover your fuel costs with your Car, Bike, or Van — our platform makes it effortless.
          </p>
        </div>

        {/* Passenger Flow */}
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-700">For Passengers</span>
            <h2 className="text-3xl font-black text-slate-900">Find &amp; Book Your Next Ride in 3 Easy Steps</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full mt-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-purple-200 -z-10 transform -translate-y-1/2" />
            
            <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-[0_10px_30px_rgba(124,58,237,0.06)] hover:border-purple-300 hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)] transition-all text-center relative group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">1. Search &amp; Filter</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter origin, destination, and date. Filter rides by vehicle type (Car, Bike, Van), AC availability, and instant booking status.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-[0_10px_30px_rgba(124,58,237,0.06)] hover:border-purple-300 hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)] transition-all text-center relative group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">2. Reserve Seat</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Review driver verification ratings, vehicle model, and amenities. Book instantly or send a seat request with 1 tap.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-[0_10px_30px_rgba(124,58,237,0.06)] hover:border-purple-300 hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)] transition-all text-center relative group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">3. Travel Together</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Meet at the agreed transit point, follow real-time GPS tracking on your live dashboard, and pay your fuel share securely.
              </p>
            </div>
          </div>
        </div>

        {/* Driver Flow */}
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">For Drivers</span>
            <h2 className="text-3xl font-black text-slate-900">Offer Rides &amp; Cut Travel Expenses</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-emerald-200 -z-10 transform -translate-y-1/2" />
            
            <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-[0_10px_30px_rgba(124,58,237,0.06)] hover:border-purple-300 hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)] transition-all text-center relative group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">1. Publish in 3 Steps</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Choose vehicle (Car, Bike, Van), pick route, view interactive highway map with 1-tap stop suggestions, and set fair seat prices.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-[0_10px_30px_rgba(124,58,237,0.06)] hover:border-purple-300 hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)] transition-all text-center relative group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">2. Manage Bookings</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Receive notifications when travelers request seats. Review passenger profiles and approve bookings with full control.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-purple-100 shadow-[0_10px_30px_rgba(124,58,237,0.06)] hover:border-purple-300 hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)] transition-all text-center relative group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform">
                <IndianRupee className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">3. Broadcast GPS &amp; Earn</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Broadcast live device GPS during the trip for co-traveler safety and receive instant cost contributions directly after drop-off.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to Start Sharing Rides?</h3>
            <p className="text-xs sm:text-sm text-purple-200">Join over 120,000+ verified members across India saving on intercity trips.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/search"
              className="px-6 py-3.5 bg-white text-purple-900 hover:bg-purple-50 font-black rounded-2xl shadow-lg transition-transform active:scale-95 text-xs sm:text-sm"
            >
              Find a Ride
            </Link>
            <Link
              to="/publish"
              className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-lg shadow-purple-600/30 transition-transform active:scale-95 text-xs sm:text-sm flex items-center gap-2"
            >
              <span>Offer a Ride</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
