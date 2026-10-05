import React from 'react';
import { Search, CalendarCheck, Map, Car, Users, IndianRupee } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="pt-28 pb-16 min-h-screen bg-brand-offwhite">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
            How <span className="text-brand-deepblue">RB Rides</span> Works
          </h1>
          <p className="text-lg text-brand-dark/70 max-w-2xl mx-auto">
            Whether you're looking to save on travel costs by finding a ride, or you're driving and want to share your empty seats, our platform makes it easy and safe.
          </p>
        </div>

        {/* Passenger Flow */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-brand-dark mb-4">For Passengers: Find a Ride</h2>
            <div className="w-24 h-1 bg-brand-lightblue mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-10 transform -translate-y-1/2"></div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center relative">
              <div className="w-16 h-16 bg-brand-deepblue text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-deepblue/30">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Search</h3>
              <p className="text-slate-600 text-sm">
                Enter your departure city, destination, and travel date. Browse through available rides and filter by vehicle type (Bike, Car, Van).
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center relative">
              <div className="w-16 h-16 bg-brand-deepblue text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-deepblue/30">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Request to Book</h3>
              <p className="text-slate-600 text-sm">
                Review the driver's profile, vehicle details, and rules. Send a ride request and wait for the driver to confirm your seat.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center relative">
              <div className="w-16 h-16 bg-brand-deepblue text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-deepblue/30">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Travel Together</h3>
              <p className="text-slate-600 text-sm">
                Meet at the pickup point, enjoy the journey, and pay your share of the costs directly to the driver via cash or UPI.
              </p>
            </div>
          </div>
        </div>

        {/* Driver Flow */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-brand-dark mb-4">For Drivers: Offer a Ride</h2>
            <div className="w-24 h-1 bg-emerald-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-10 transform -translate-y-1/2"></div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center relative">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Publish Ride</h3>
              <p className="text-slate-600 text-sm">
                Use our 9-step wizard to define your route, add intermediate city stops, set your price per seat, and verify your vehicle documents.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center relative">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Manage Requests</h3>
              <p className="text-slate-600 text-sm">
                Receive notifications when passengers request to join your ride. Review their profiles and approve or decline requests from your dashboard.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center relative">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                <IndianRupee className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Drive & Get Paid</h3>
              <p className="text-slate-600 text-sm">
                Start the live tracker when your trip begins. Collect your travel cost contributions directly from your passengers during the trip.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
