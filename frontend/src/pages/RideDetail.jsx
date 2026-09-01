import React, { useState, useEffect } from 'react';
import { getRideDetail, requestRide } from '../api';
import { MapPin, Calendar, Clock, Star, ShieldCheck, Zap, Car, CheckCircle2, User, Phone, X, Luggage } from 'lucide-react';

// Add capitalize method to String prototype
if (!String.prototype.capitalize) {
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
  };
}

export default function RideDetail({ rideId, onBack, onRequestRide, user }) {
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Request Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [passengerName, setPassengerName] = useState('Anand Passenger');
  const [passengerPhone, setPassengerPhone] = useState('+91 9988776655');
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [pickupCity, setPickupCity] = useState('');
  const [dropoffCity, setDropoffCity] = useState('');
  const [displayPrice, setDisplayPrice] = useState(0);

  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  // Helper function to calculate segment price
  const calculateSegmentPrice = (boarding, alighting, segmentPrices) => {
    if (!segmentPrices || Object.keys(segmentPrices).length === 0) {
      return ride?.price || 0;
    }

    // Try different separator formats
    for (const sep of [' → ', '-', ' - ']) {
      // Try exact match and case variations
      for (const b of [boarding, boarding.capitalize()]) {
        for (const a of [alighting, alighting.capitalize()]) {
          const key = `${b}${sep}${a}`;
          if (key in segmentPrices) {
            return segmentPrices[key];
          }
        }
      }
    }

    // Fallback to ride price
    return ride?.price || 0;
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getRideDetail(rideId);
        setRide(data);
        setPickupCity(data.origin);
        setDropoffCity(data.destination);
      } catch (err) {
        setError('Unable to load ride details.');
      } finally {
        setLoading(false);
      }
    };

    if (rideId) fetchDetail();
  }, [rideId]);

  // Calculate display price whenever ride, pickupCity, or dropoffCity changes
  useEffect(() => {
    if (ride && pickupCity && dropoffCity) {
      const segmentPrices = ride.segment_prices || {};
      const calculatedPrice = calculateSegmentPrice(pickupCity, dropoffCity, segmentPrices);
      setDisplayPrice(calculatedPrice);
    }
  }, [ride, pickupCity, dropoffCity]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    try {
      if (onRequestRide) {
        await onRequestRide(rideId, pickupCity, dropoffCity, seatsToBook);
      } else {
        await requestRide(rideId, {
          passenger_name: passengerName,
          passenger_phone: passengerPhone,
          pickup_city: pickupCity,
          dropoff_city: dropoffCity,
          seats: seatsToBook
        });
      }
      setRequestSubmitted(true);
    } catch (err) {
      alert('Request submission failed. Please try again.');
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading ride information...</div>;
  if (error || !ride) return <div className="p-12 text-center text-red-600">{error || 'Ride not found'}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {/* Navigation back */}
      <button
        onClick={onBack}
        className="text-sm font-bold text-slate-600 hover:text-cyan-600 flex items-center space-x-1"
      >
        <span>&larr; Back to Search Results</span>
      </button>

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

        {/* Header Header Route & Date */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full border border-cyan-400/30">
              {ride.departure_date}
            </span>
            <div className="text-2xl font-black text-white">
              ₹{displayPrice > 0 ? displayPrice : ride.price} <span className="text-xs font-normal text-slate-300">/ passenger</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xl sm:text-2xl font-extrabold">
            <span>{ride.origin}</span>
            <span className="text-cyan-400">&rarr;</span>
            <span>{ride.destination}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Route Timeline & Details */}
          <div className="md:col-span-2 space-y-6">

            {/* Timeline */}
            <div className="space-y-6 pl-4 border-l-2 border-cyan-600 relative">
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-cyan-600 absolute -left-[25px] top-1 ring-4 ring-cyan-100" />
                <div className="text-lg font-bold text-slate-900">{ride.departure_time} - {ride.origin}</div>
                <div className="text-sm text-slate-500">{ride.origin_address}</div>
              </div>

              <div className="py-2 text-xs font-bold text-slate-400">
                Duration: {ride.duration}
              </div>

              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-cyan-600 absolute -left-[25px] top-1 ring-4 ring-cyan-100" />
                <div className="text-lg font-bold text-slate-900">{ride.arrival_time} - {ride.destination}</div>
                <div className="text-sm text-slate-500">{ride.destination_address}</div>
              </div>
            </div>

            {/* City Intermediate Stops */}
            {ride.city_stops && ride.city_stops.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Intermediate Route City Stops</h4>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  {ride.city_stops.map((stop, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                      {stop.city} ({stop.distance_km} km)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Car Rules & Amenities */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Ride Amenities & Rules</h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                {/* Dynamic Amenities */}
                {(ride.amenities || []).map((amenity, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center space-x-2">
                    {amenity.toLowerCase().includes('luggage') ? (
                      <Luggage className="w-4 h-4 text-cyan-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    <span>{amenity}</span>
                  </div>
                ))}
                
                {/* Dynamic Rules */}
                {(ride.rules || []).map((rule, idx) => (
                  <div key={`rule-${idx}`} className="p-3 bg-slate-50 rounded-xl flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-cyan-600" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Driver & Booking Sidebox */}
          <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit">

            {/* Driver Profile */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  src={ride.driver.avatar}
                  alt={ride.driver.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-cyan-600 shadow"
                />
                <div>
                  <div className="flex items-center space-x-1 font-bold text-slate-900 text-base">
                    <span>{ride.driver.name}</span>
                    <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{ride.driver.rating}</span>
                    <span className="text-slate-400">({ride.driver.reviews_count} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 italic">"{ride.driver.bio}"</p>
            </div>

            {/* Vehicle Info */}
            <div className="pt-3 border-t border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-800">Car Details</div>
              <div className="text-slate-600">{ride.vehicle.model} ({ride.vehicle.plate_number})</div>
            </div>

            {/* Seat Availability & Request Action */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Available Seats:</span>
                <span className="font-extrabold text-cyan-700">{ride.seats_available} left</span>
              </div>

              {user?.name === ride.driver.name ? (
                <div className="w-full py-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-center font-bold text-sm rounded-xl flex items-center justify-center space-x-2">
                  <Car className="w-5 h-5" />
                  <span>This is your published ride</span>
                </div>
              ) : ride.seats_available > 0 ? (
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-600/30 transition-transform active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Send Ride Request to Driver</span>
                </button>
              ) : (
                <div className="p-3 bg-slate-200 text-slate-600 text-center font-bold text-xs rounded-xl">
                  Fully Booked
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Booking Request Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6">

            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!requestSubmitted ? (
              <form onSubmit={handleSendRequest} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Request Ride Confirmation</h3>
                <p className="text-xs text-slate-500">
                  Select your boarding & drop-off city for price calculation.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pickup City</label>
                    <input
                      type="text"
                      required
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Drop-off City</label>
                    <input
                      type="text"
                      required
                      value={dropoffCity}
                      onChange={(e) => setDropoffCity(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Passenger Name</label>
                  <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <User className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                  <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Number of Seats</label>
                  <select
                    value={seatsToBook}
                    onChange={(e) => setSeatsToBook(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                  >
                    {[...Array(ride.seats_available).keys()].map((n) => (
                      <option key={n + 1} value={n + 1}>
                        {n + 1} Seat ({`₹${displayPrice * (n + 1)}`})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-cyan-50 rounded-2xl flex justify-between items-center text-slate-900 font-bold text-sm">
                  <span>Segment Fare Total:</span>
                  <span className="text-xl font-black text-cyan-700">₹{displayPrice * seatsToBook}</span>
                </div>

                <button
                  type="submit"
                  disabled={requestLoading}
                  className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/30 transition-transform active:scale-95"
                >
                  {requestLoading ? 'Sending Request...' : 'Send Request to Driver'}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Request Sent to Driver!</h3>
                <p className="text-xs text-slate-500">
                  The driver ({ride.driver.name}) will review and accept your request. You can track live GPS progress on your dashboard.
                </p>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setRequestSubmitted(false);
                  }}
                  className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl"
                >
                  Close & View Live Tracking
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
