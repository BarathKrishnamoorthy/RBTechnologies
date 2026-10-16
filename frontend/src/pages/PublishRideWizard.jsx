import React, { useState, useMemo, useEffect } from 'react';
import { publishRideAdvanced } from '../api';
import { 
  MapPin, Calendar, Clock, Car, ShieldCheck, CheckCircle2, 
  ArrowRight, ArrowLeftRight, Users, Sparkles, Plus, Trash2, 
  Check, AlertCircle, ChevronRight, ChevronLeft, Zap, Info
} from 'lucide-react';
import RouteMap from '../components/RouteMap';
import CityAutocomplete from '../components/CityAutocomplete';

// Popular quick-selection hubs
const POPULAR_CITIES = ['Chennai', 'Bengaluru', 'Coimbatore', 'Madurai', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi'];

const POPULAR_CAR_PRESETS = [
  'Innova Crysta (White)',
  'Honda City (Silver)',
  'Maruti Swift Dzire (White)',
  'Hyundai Creta (Grey)',
  'Tata Nexon (Blue)',
  'Mahindra XUV700 (Black)'
];

// OSRM Road Distance Helper
async function fetchKmBetween(from, to) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=false`;
    const r = await fetch(url);
    const d = await r.json();
    if (d.code !== 'Ok' || !d.routes?.length) return null;
    return Math.round(d.routes[0].distance / 1000); // meters to km
  } catch {
    return null;
  }
}

async function geocodeCity(city) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1&countrycodes=in`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const d = await r.json();
    if (!d.length) return null;
    return [parseFloat(d[0].lat), parseFloat(d[0].lon)];
  } catch {
    return null;
  }
}

export default function PublishRideWizard({ onPublishSuccess, user }) {
  // 3-Step Streamlined Flow: 1: Route & Schedule | 2: Seats & Price | 3: Vehicle & Publish
  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1 STATE: Route & Schedule
  const [origin, setOrigin] = useState('Chennai');
  const [destination, setDestination] = useState('Bengaluru');
  const [departureDate, setDepartureDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [departureTime, setDepartureTime] = useState('06:30');
  const [showStops, setShowStops] = useState(false);
  const [stops, setStops] = useState([]);
  const [newStopInput, setNewStopInput] = useState('');
  const [estimatedKm, setEstimatedKm] = useState(345);
  const [calculatingRoute, setCalculatingRoute] = useState(false);

  // STEP 2 STATE: Seats & Price
  const [seatsAvailable, setSeatsAvailable] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(450);
  const [instantBooking, setInstantBooking] = useState(true);

  // STEP 3 STATE: Vehicle & Amenities
  const [vehicleModel, setVehicleModel] = useState('Innova Crysta');
  const [plateNumber, setPlateNumber] = useState('TN 07 RB 9988');
  const [hasAc, setHasAc] = useState(true);
  const [luggageAllowed, setLuggageAllowed] = useState(true);
  const [max2InBack, setMax2InBack] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Auto-calculate distance when origin/destination change
  useEffect(() => {
    let active = true;
    const calcDistance = async () => {
      if (!origin || !destination || origin.toLowerCase() === destination.toLowerCase()) return;
      setCalculatingRoute(true);
      try {
        const c1 = await geocodeCity(origin);
        const c2 = await geocodeCity(destination);
        if (c1 && c2 && active) {
          const km = await fetchKmBetween(c1, c2);
          if (km && active) {
            setEstimatedKm(km);
            // Suggest fair price: approx ₹1.4 - ₹1.8 per km
            const suggested = Math.max(100, Math.round((km * 1.5) / 50) * 50);
            setPricePerSeat(suggested);
          }
        }
      } catch {
        // Fallback default
      } finally {
        if (active) setCalculatingRoute(false);
      }
    };

    const timer = setTimeout(calcDistance, 600);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [origin, destination]);

  const handleSwap = () => {
    const tmp = origin;
    setOrigin(destination);
    setDestination(tmp);
  };

  const addStop = () => {
    if (!newStopInput.trim()) return;
    if (!stops.includes(newStopInput.trim())) {
      setStops([...stops, newStopInput.trim()]);
    }
    setNewStopInput('');
  };

  const removeStop = (idx) => {
    setStops(stops.filter((_, i) => i !== idx));
  };

  // Estimated Travel Duration based on km
  const estimatedHours = Math.max(1, Math.round(estimatedKm / 60));
  const estimatedMinutes = Math.round((estimatedKm % 60) * 0.8);
  const durationText = `${estimatedHours}h ${estimatedMinutes > 0 ? estimatedMinutes + 'm' : ''}`;

  const handleFinalPublish = async () => {
    setError(null);
    setLoading(true);

    try {
      // Build city stops & proportional segment prices
      const cityStopsPayload = [
        { city: origin, distance_km: 0 },
        ...stops.map((s, i) => ({
          city: s,
          distance_km: Math.round(((i + 1) / (stops.length + 1)) * estimatedKm)
        })),
        { city: destination, distance_km: estimatedKm }
      ];

      const segmentPricesPayload = {};
      cityStopsPayload.forEach((s1, i) => {
        cityStopsPayload.slice(i + 1).forEach((s2) => {
          const segDist = s2.distance_km - s1.distance_km;
          const ratio = Math.max(0.2, segDist / Math.max(1, estimatedKm));
          segmentPricesPayload[`${s1.city} → ${s2.city}`] = Math.round(pricePerSeat * ratio);
        });
      });

      const payload = {
        origin,
        destination,
        origin_address: `${origin} Main Pickup Point`,
        destination_address: `${destination} City Center`,
        departure_date: departureDate,
        departure_time: departureTime,
        arrival_time: `${(parseInt(departureTime.split(':')[0]) + estimatedHours) % 24}:${departureTime.split(':')[1]}`,
        duration: durationText,
        price: Number(pricePerSeat),
        seats_available: Number(seatsAvailable),
        total_seats: Number(seatsAvailable),
        driver_name: user?.name || 'Verified Driver',
        driver_phone: user?.phone || '+91 9876543210',
        vehicle_model: vehicleModel,
        plate_number: plateNumber,
        has_ac: hasAc,
        luggage_allowed: luggageAllowed,
        max_2_in_back: max2InBack,
        city_stops: cityStopsPayload,
        segment_prices: segmentPricesPayload,
        amenities: [
          hasAc ? 'Air Conditioned' : null,
          luggageAllowed ? 'Luggage Space Included' : null,
          max2InBack ? 'Max 2 in Back Seat' : null,
          instantBooking ? 'Instant Booking' : 'Driver Approval Required'
        ].filter(Boolean)
      };

      const result = await publishRideAdvanced(payload);
      setSuccess(true);
      setTimeout(() => {
        if (onPublishSuccess) {
          onPublishSuccess(result.id);
        }
      }, 1200);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to publish ride. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            Quick 3-Step Publishing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Offer a Ride &amp; Save on Fuel
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Fill your empty seats with verified co-travelers heading your way in under 1 minute.
          </p>
        </div>

        {/* Streamlined 3-Step Progress Indicator */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            
            {/* Step 1 */}
            <div 
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${
                currentStep === 1 
                  ? 'bg-cyan-50 border border-cyan-300 text-cyan-900' 
                  : currentStep > 1 
                  ? 'bg-emerald-50/60 text-emerald-800' 
                  : 'text-slate-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep === 1 
                  ? 'bg-cyan-600 text-white shadow-md' 
                  : currentStep > 1 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-extrabold uppercase tracking-wider">Step 1</div>
                <div className="text-sm font-bold truncate">Route &amp; Time</div>
              </div>
            </div>

            {/* Step 2 */}
            <div 
              onClick={() => origin && destination && setCurrentStep(2)}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                currentStep === 2 
                  ? 'bg-cyan-50 border border-cyan-300 text-cyan-900 cursor-pointer' 
                  : currentStep > 2 
                  ? 'bg-emerald-50/60 text-emerald-800 cursor-pointer' 
                  : 'text-slate-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep === 2 
                  ? 'bg-cyan-600 text-white shadow-md' 
                  : currentStep > 2 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-extrabold uppercase tracking-wider">Step 2</div>
                <div className="text-sm font-bold truncate">Seats &amp; Price</div>
              </div>
            </div>

            {/* Step 3 */}
            <div 
              onClick={() => origin && destination && setCurrentStep(3)}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                currentStep === 3 
                  ? 'bg-cyan-50 border border-cyan-300 text-cyan-900 cursor-pointer' 
                  : 'text-slate-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep === 3 
                  ? 'bg-cyan-600 text-white shadow-md' 
                  : 'bg-slate-200 text-slate-500'
              }`}>
                3
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-extrabold uppercase tracking-wider">Step 3</div>
                <div className="text-sm font-bold truncate">Vehicle &amp; Publish</div>
              </div>
            </div>

          </div>
        </div>

        {/* Wizard Card Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl transition-all">

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-xl font-extrabold text-emerald-950">Ride Published Successfully!</h3>
              <p className="text-emerald-700 text-sm">Your ride is now visible to passengers. Redirecting to your dashboard...</p>
            </div>
          )}

          {/* ================= STEP 1: ROUTE & SCHEDULE ================= */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Where and when are you traveling?</h2>
                <p className="text-sm text-slate-500 mt-1">Set your pickup point, final destination, and travel date.</p>
              </div>

              {/* Origin & Destination Inputs */}
              <div className="space-y-4">
                <div className="relative grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
                  
                  {/* Origin */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                      Departure City (Origin)
                    </label>
                    <CityAutocomplete
                      value={origin}
                      onChange={setOrigin}
                      placeholder="e.g. Chennai"
                      iconColor="text-cyan-600"
                    />
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center md:pt-6">
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="p-3 rounded-full bg-slate-100 hover:bg-cyan-50 hover:text-cyan-600 text-slate-600 border border-slate-200 transition-all hover:scale-105 active:scale-95"
                      title="Swap cities"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                      Destination City
                    </label>
                    <CityAutocomplete
                      value={destination}
                      onChange={setDestination}
                      placeholder="e.g. Bengaluru"
                      iconColor="text-blue-600"
                    />
                  </div>
                </div>

                {/* Popular Quick-Select Chips */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-xs font-bold text-slate-400">Quick hubs:</span>
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        if (!origin) setOrigin(city);
                        else if (!destination) setDestination(city);
                        else setDestination(city);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Departure Date
                  </label>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                    <input
                      type="date"
                      value={departureDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-900 text-base focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Departure Time
                  </label>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <input
                      type="time"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-900 text-base focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Distance & Map Preview */}
              <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5" />
                    Route Estimate
                  </div>
                  <div className="text-xl font-extrabold">
                    {origin || 'Origin'} &rarr; {destination || 'Destination'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {calculatingRoute ? 'Calculating route...' : `Approx. ${estimatedKm} km · ${durationText} travel time`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowStops(!showStops)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showStops ? 'Hide Via Stops' : '+ Add Via Stop'}
                </button>
              </div>

              {/* Optional Intermediate Stops (Collapsible) */}
              {showStops && (
                <div className="p-5 bg-cyan-50/50 border border-cyan-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-900">
                      En-Route Stopovers (Optional)
                    </span>
                    <span className="text-xs text-slate-500">Pick up passengers along your highway</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStopInput}
                      onChange={(e) => setNewStopInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStop())}
                      placeholder="Add a city stop (e.g. Vellore, Hosur)"
                      className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={addStop}
                      className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Add Stop
                    </button>
                  </div>

                  {stops.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {stops.map((stop, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-cyan-200 rounded-lg text-xs font-bold text-cyan-950 shadow-sm"
                        >
                          <MapPin className="w-3 h-3 text-cyan-600" />
                          {stop}
                          <button
                            type="button"
                            onClick={() => removeStop(idx)}
                            className="text-slate-400 hover:text-rose-500 ml-1"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 1 Footer Action */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  disabled={!origin.trim() || !destination.trim()}
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-300 disabled:to-slate-300 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-cyan-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continue to Seats &amp; Price
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: SEATS & PRICE ================= */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">How many seats &amp; what's the fare?</h2>
                <p className="text-sm text-slate-500 mt-1">Set fair pricing and available passenger capacity.</p>
              </div>

              {/* Seats Selector */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base font-extrabold text-slate-900">Available Passenger Seats</div>
                    <div className="text-xs text-slate-500">Only count seats you are comfortable sharing</div>
                  </div>
                  <div className="flex items-center gap-4 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
                    <button
                      type="button"
                      onClick={() => setSeatsAvailable(Math.max(1, seatsAvailable - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-extrabold text-lg text-slate-700 flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="text-2xl font-black text-slate-900 w-8 text-center">
                      {seatsAvailable}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSeatsAvailable(Math.min(6, seatsAvailable + 1))}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-extrabold text-lg text-slate-700 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Visual Seats Row */}
                <div className="flex items-center gap-2 pt-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setSeatsAvailable(i + 1)}
                      className={`flex-1 py-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                        i < seatsAvailable
                          ? 'bg-cyan-600 border-cyan-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      Seat {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Selector */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-extrabold text-slate-900">Price per Passenger Seat</div>
                    <div className="text-xs text-slate-500">
                      Recommended: <span className="font-bold text-cyan-700">₹{Math.round((estimatedKm * 1.5) / 50) * 50}</span> for {estimatedKm} km
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPricePerSeat(Math.max(50, pricePerSeat - 50))}
                      className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-700 transition-colors"
                    >
                      - ₹50
                    </button>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">₹</span>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        value={pricePerSeat}
                        onChange={(e) => setPricePerSeat(Math.max(10, Number(e.target.value)))}
                        className="w-32 pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setPricePerSeat(pricePerSeat + 50)}
                      className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-700 transition-colors"
                    >
                      + ₹50
                    </button>
                  </div>
                </div>

                {/* Earnings Projection Pill */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-emerald-900 text-xs font-bold">
                    <span className="text-base">💰</span>
                    <span>Total fuel cost recovery with full car:</span>
                  </div>
                  <span className="text-lg font-black text-emerald-700">
                    ₹{seatsAvailable * pricePerSeat}
                  </span>
                </div>
              </div>

              {/* Instant Booking Toggle */}
              <div 
                onClick={() => setInstantBooking(!instantBooking)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  instantBooking 
                    ? 'border-cyan-600 bg-cyan-50/50 shadow-sm' 
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${instantBooking ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">Instant Booking Enabled</div>
                    <div className="text-xs text-slate-500">Passengers book immediately without waiting for your manual approval</div>
                  </div>
                </div>
                <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${instantBooking ? 'bg-cyan-600' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${instantBooking ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Step 2 Footer Navigation */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-cyan-600/25 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continue to Vehicle &amp; Confirm
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: VEHICLE & CONFIRM ================= */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Your Vehicle &amp; Trip Review</h2>
                <p className="text-sm text-slate-500 mt-1">Confirm your ride details and publish to thousands of co-travelers.</p>
              </div>

              {/* Vehicle Info */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                <div className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Car className="w-5 h-5 text-cyan-600" />
                  Vehicle Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Car Model &amp; Make
                    </label>
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="e.g. Innova Crysta (White)"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Plate Number
                    </label>
                    <input
                      type="text"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. TN 07 RB 9988"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 tracking-wider"
                    />
                  </div>
                </div>

                {/* Popular Car Preset Chips */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-xs font-bold text-slate-400">Suggestions:</span>
                  {POPULAR_CAR_PRESETS.map((car) => (
                    <button
                      key={car}
                      type="button"
                      onClick={() => setVehicleModel(car)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                    >
                      {car}
                    </button>
                  ))}
                </div>

                {/* Amenities Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setHasAc(!hasAc)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      hasAc ? 'bg-cyan-50 border-cyan-400 text-cyan-900' : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>❄️</span> Air Conditioned
                  </button>
                  <button
                    type="button"
                    onClick={() => setLuggageAllowed(!luggageAllowed)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      luggageAllowed ? 'bg-cyan-50 border-cyan-400 text-cyan-900' : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>🧳</span> Luggage Allowed
                  </button>
                  <button
                    type="button"
                    onClick={() => setMax2InBack(!max2InBack)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      max2InBack ? 'bg-cyan-50 border-cyan-400 text-cyan-900' : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>👥</span> Max 2 in Back
                  </button>
                </div>
              </div>

              {/* Trip Summary Boarding Ticket */}
              <div className="border-2 border-dashed border-slate-300 rounded-3xl p-6 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-cyan-800">
                    <ShieldCheck className="w-4 h-4 text-cyan-600" />
                    Verified RB Trip Summary
                  </div>
                  <span className="px-3 py-1 bg-cyan-600 text-white rounded-full text-xs font-black">
                    ₹{pricePerSeat} / seat
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Route</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">{origin} &rarr; {destination}</div>
                    <div className="text-xs text-slate-500">{estimatedKm} km · {durationText}</div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Departure</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">{departureDate}</div>
                    <div className="text-xs text-slate-500">At {departureTime}</div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Capacity &amp; Vehicle</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">{seatsAvailable} Seats Available</div>
                    <div className="text-xs text-slate-500">{vehicleModel}</div>
                  </div>
                </div>

                {stops.length > 0 && (
                  <div className="text-xs text-slate-600 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                    <span className="font-bold">Via Stops:</span> {stops.join(' · ')}
                  </div>
                )}
              </div>

              {/* Final Publish Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="button"
                  disabled={loading || success}
                  onClick={handleFinalPublish}
                  className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publishing Ride...
                    </>
                  ) : (
                    <>
                      Publish Ride Now 🚀
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
