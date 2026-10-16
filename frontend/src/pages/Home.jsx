import React, { useState, useMemo } from 'react';
import { 
  MapPin, Calendar, Users, Search, ArrowRight, ShieldCheck, 
  Leaf, Car, ArrowLeftRight, CheckCircle2, Zap, Star, ChevronRight,
  TrendingUp, Clock, Compass, DollarSign, Award, Navigation, ThumbsUp, Sparkles, Fuel
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const POPULAR_SEARCH_HUBS = [
  { origin: 'Chennai', destination: 'Bengaluru', price: '₹400', time: '5h 30m', tag: 'Most Popular' },
  { origin: 'Mumbai', destination: 'Pune', price: '₹350', time: '3h 15m', tag: 'Fast Commute' },
  { origin: 'Bengaluru', destination: 'Hyderabad', price: '₹550', time: '8h 00m', tag: 'Daily Route' },
  { origin: 'Delhi', destination: 'Jaipur', price: '₹450', time: '4h 45m', tag: 'Weekend Getaway' },
  { origin: 'Coimbatore', destination: 'Chennai', price: '₹500', time: '7h 15m', tag: 'Express' },
];

const FEATURED_LIVE_RIDES = [
  {
    id: 'ride-101',
    driver: 'Karthik Subramanian',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 4.95,
    reviews: 52,
    origin: 'Chennai',
    originLoc: 'Koyambedu Bus Terminus',
    destination: 'Bengaluru',
    destLoc: 'Silk Board / Electronic City',
    date: 'Tomorrow',
    time: '06:30 AM',
    price: 450,
    seatsLeft: 3,
    car: 'Innova Crysta (AC)',
    instant: true,
  },
  {
    id: 'ride-102',
    driver: 'Rajesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    reviews: 88,
    origin: 'Mumbai',
    originLoc: 'Dadar TT Circle',
    destination: 'Pune',
    destLoc: 'Wakad / Swargate',
    date: 'Tomorrow',
    time: '08:00 AM',
    price: 350,
    seatsLeft: 2,
    car: 'Hyundai Creta (AC)',
    instant: true,
  },
  {
    id: 'ride-103',
    driver: 'Sneha Reddy',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 4.88,
    reviews: 34,
    origin: 'Bengaluru',
    originLoc: 'Hebbal Flyover',
    destination: 'Hyderabad',
    destLoc: 'Gachibowli / Hitec City',
    date: 'Friday',
    time: '05:30 AM',
    price: 550,
    seatsLeft: 3,
    car: 'Tata Nexon EV (AC)',
    instant: false,
  },
];

const REVIEWS = [
  {
    name: 'Ananya Sharma',
    role: 'Software Engineer, Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    quote: 'I travel between Chennai and Bengaluru every second weekend. RB Rides cut my travel cost by 60% compared to private cabs, and the co-passengers were wonderful tech professionals!',
    rating: 5,
    route: 'Chennai → Bengaluru'
  },
  {
    name: 'Vikram Joshi',
    role: 'Product Designer, Mumbai',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    quote: 'As a car owner driving Mumbai-Pune twice a week, I easily offset ₹10,000+ in fuel and expressway tolls each month. The 3-step publishing is incredibly fast.',
    rating: 5,
    route: 'Mumbai → Pune'
  },
  {
    name: 'Pooja Iyer',
    role: 'Consultant, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: 'The live trip tracking feature gives my family 100% peace of mind. All drivers are verified with government ID and driving licenses.',
    rating: 5,
    route: 'Hyderabad → Vijayawada'
  }
];

export default function Home({ onSearch }) {
  const navigate = useNavigate();

  // Search Form State
  const [activeTab, setActiveTab] = useState('find'); // 'find' | 'offer'
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [seats, setSeats] = useState(1);

  // Interactive Calculator State
  const [commuteDist, setCommuteDist] = useState(120);
  const [commuteDays, setCommuteDays] = useState(4);

  // How it works tab state ('passenger' | 'driver')
  const [howTab, setHowTab] = useState('passenger');

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'offer') {
      navigate('/publish');
      return;
    }
    onSearch({ origin, destination, date, seats });
  };

  const selectQuickRoute = (from, to) => {
    setOrigin(from);
    setDestination(to);
    onSearch({ origin: from, destination: to, date, seats });
  };

  // Calculator Savings
  const monthlySavings = useMemo(() => {
    // Approx ₹7 per km driving solo vs ₹2 per km sharing
    const monthlyKm = commuteDist * commuteDays * 4;
    const soloCost = monthlyKm * 7.5;
    const carpoolCost = monthlyKm * 2.5;
    return Math.round(soloCost - carpoolCost);
  }, [commuteDist, commuteDays]);

  const fuelSavedLitres = Math.round((commuteDist * commuteDays * 4) / 14);
  const co2OffsetKg = Math.round(fuelSavedLitres * 2.3);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden mesh-gradient-bg">
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Top Trust Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-xl text-white text-xs sm:text-sm font-bold shadow-lg transition-all animate-float">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Over 120,000+ Trips Shared Across 80+ Indian Cities</span>
          </div>

          {/* Main Hero Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Travel Together. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                Save Up to 70% on Every Trip.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Connect with verified co-travelers and drivers heading your way. 
              Safe, budget-friendly, and air-conditioned city-to-city carpooling.
            </p>
          </div>

          {/* ================= FLOATING GLASS SEARCH DOCK ================= */}
          <div className="max-w-4xl mx-auto pt-4">
            
            {/* Find / Offer Toggle Tabs */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 mb-4 shadow-xl">
              <button
                type="button"
                onClick={() => setActiveTab('find')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === 'find' 
                    ? 'bg-white text-slate-900 shadow-md scale-100' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4 text-cyan-600" />
                Find a Ride
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('offer');
                  navigate('/publish');
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === 'offer' 
                    ? 'bg-white text-slate-900 shadow-md scale-100' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Car className="w-4 h-4 text-cyan-600" />
                Offer a Ride (Earn ₹)
              </button>
            </div>

            {/* The Search Box Bar */}
            <form 
              onSubmit={handleSearchSubmit}
              className="glass-dock rounded-3xl p-3 sm:p-4 shadow-2xl space-y-3 sm:space-y-0 sm:grid sm:grid-cols-[1fr,auto,1fr,1fr,auto,auto] gap-2 items-center text-left"
            >
              
              {/* Origin */}
              <div className="px-4 py-2 hover:bg-slate-50/80 rounded-2xl transition-colors">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Leaving From</label>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Chennai"
                    className="w-full bg-transparent font-bold text-slate-900 text-sm sm:text-base focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-cyan-50 hover:text-cyan-600 text-slate-500 transition-all hover:rotate-180 duration-300"
                  title="Swap Origin & Destination"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* Destination */}
              <div className="px-4 py-2 hover:bg-slate-50/80 rounded-2xl transition-colors">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Going To</label>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full bg-transparent font-bold text-slate-900 text-sm sm:text-base focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="px-4 py-2 hover:bg-slate-50/80 rounded-2xl transition-colors border-t sm:border-t-0 sm:border-l border-slate-200">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Date</label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Calendar className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="px-3 py-2 hover:bg-slate-50/80 rounded-2xl transition-colors border-t sm:border-t-0 sm:border-l border-slate-200">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Seats</label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Users className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                  <select
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'seat' : 'seats'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search CTA Button */}
              <div className="p-1">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4 stroke-[3]" />
                  <span>Find Rides</span>
                </button>
              </div>

            </form>

            {/* Quick Popular Route Chips */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-4 text-xs font-semibold text-white/80">
              <span className="text-white/50 font-bold">Trending corridors:</span>
              {POPULAR_SEARCH_HUBS.map((hub, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectQuickRoute(hub.origin, hub.destination)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                >
                  <span>{hub.origin} &rarr; {hub.destination}</span>
                  <span className="text-cyan-300 font-extrabold">{hub.price}</span>
                </button>
              ))}
            </div>

          </div>

        </div>

      </section>

      {/* ================= KEY METRICS COUNTER ================= */}
      <section className="relative -mt-8 max-w-6xl mx-auto px-4 z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">120K+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Rides Shared</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">₹4.2 Cr</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Saved by Co-Travelers</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-cyan-600 tracking-tight">4.95 ★</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Driver Rating</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">100%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Govt ID &amp; DL Verified</div>
          </div>

        </div>
      </section>

      {/* ================= LIVE FEATURED RIDES SECTION ================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-cyan-600" />
              Real-Time Available Rides
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Departing Soon Near You
            </h2>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="group flex items-center gap-2 text-cyan-700 hover:text-cyan-800 font-extrabold text-sm transition-colors cursor-pointer"
          >
            <span>View All 850+ Active Rides</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Featured Ride Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_LIVE_RIDES.map((ride) => (
            <div
              key={ride.id}
              onClick={() => navigate(`/ride/${ride.id}`)}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-5">
                
                {/* Header: Date + Price */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                      {ride.date} · {ride.time}
                    </span>
                    {ride.instant && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-amber-500" /> Instant
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">₹{ride.price}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">per seat</div>
                  </div>
                </div>

                {/* Route Visualizer */}
                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full" />
                  
                  {/* Origin */}
                  <div>
                    <div className="text-base font-extrabold text-slate-900">{ride.origin}</div>
                    <div className="text-xs text-slate-500 truncate">{ride.originLoc}</div>
                  </div>

                  {/* Destination */}
                  <div>
                    <div className="text-base font-extrabold text-slate-900">{ride.destination}</div>
                    <div className="text-xs text-slate-500 truncate">{ride.destLoc}</div>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={ride.avatar}
                      alt={ride.driver}
                      className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/20"
                    />
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        {ride.driver}
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                      </div>
                      <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{ride.rating}</span>
                        <span className="text-slate-400">({ride.reviews} trips)</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {ride.seatsLeft} left
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">{ride.car}</div>
                  </div>
                </div>

              </div>

              {/* Card Footer Button */}
              <div className="pt-5">
                <button
                  type="button"
                  className="w-full py-3 bg-slate-900 group-hover:bg-cyan-600 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Book Seat Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* ================= INTERACTIVE COMMUTE SAVINGS CALCULATOR ================= */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 text-white relative overflow-hidden">
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5" />
              Fuel Savings Estimator
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              See How Much You Save Every Month
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Slide to adjust your typical one-way travel distance and frequency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
            
            {/* Sliders Column */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Distance Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-300">One-Way Trip Distance</span>
                  <span className="text-cyan-400 font-black text-lg">{commuteDist} km</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="400"
                  step="10"
                  value={commuteDist}
                  onChange={(e) => setCommuteDist(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-white/20 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                  <span>30 km (Nearby city)</span>
                  <span>200 km (Intercity)</span>
                  <span>400 km (Interstate)</span>
                </div>
              </div>

              {/* Days Per Week Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-300">Travel Frequency</span>
                  <span className="text-cyan-400 font-black text-lg">{commuteDays} trips / week</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={commuteDays}
                  onChange={(e) => setCommuteDays(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-white/20 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                  <span>1 trip (Weekend)</span>
                  <span>3-4 trips (Hybrid)</span>
                  <span>7 trips (Daily)</span>
                </div>
              </div>

            </div>

            {/* Savings Output Cards Column */}
            <div className="lg:col-span-5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
              
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-100">Estimated Monthly Savings</span>
                <div className="text-4xl sm:text-5xl font-black mt-1">₹{monthlySavings.toLocaleString()}</div>
                <p className="text-xs text-cyan-100 mt-1">Compared to driving solo or booking private cabs</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                <div>
                  <div className="text-xs text-cyan-100 font-bold uppercase">Fuel Saved</div>
                  <div className="text-2xl font-black mt-0.5">~{fuelSavedLitres} L</div>
                  <div className="text-[10px] text-cyan-100">petrol / diesel</div>
                </div>

                <div>
                  <div className="text-xs text-cyan-100 font-bold uppercase">CO₂ Prevented</div>
                  <div className="text-2xl font-black mt-0.5">{co2OffsetKg} kg</div>
                  <div className="text-[10px] text-cyan-100">cleaner air 🌱</div>
                </div>
              </div>

              <button
                onClick={() => navigate('/publish')}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Saving &bull; Offer a Ride</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ================= BENTO GRID: WHY CHOOSE RB RIDES ================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-cyan-600" />
            Safety &bull; Comfort &bull; Savings
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Trusted, Stress-Free Travel
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Every feature is designed around verified security, driver convenience, and pocket-friendly fares.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento 1: Safety */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">100% ID Verified Community</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Every driver and passenger is verified with Government ID (Aadhaar/PAN) and Driving License before publishing or booking.
            </p>
            <ul className="text-xs font-bold text-slate-700 space-y-1.5 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Government ID Verified</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Driving License Verification</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Community Star Ratings</li>
            </ul>
          </div>

          {/* Bento 2: Live Tracking */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Real-Time Live GPS Tracking</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Share real-time tracking links with family and friends with one tap. Watch your car's progress on interactive maps with live ETA.
            </p>
            <ul className="text-xs font-bold text-slate-700 space-y-1.5 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Live Vehicle GPS Stream</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1-Tap WhatsApp Share</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> In-App SOS Emergency Help</li>
            </ul>
          </div>

          {/* Bento 3: Transparent Pricing */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Zero Surge &bull; Fixed Pricing</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              No festival surge, rain multipliers, or hidden fees. Fares are fixed fairly per seat based on distance, keeping journeys predictable.
            </p>
            <ul className="text-xs font-bold text-slate-700 space-y-1.5 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 70% Cheaper than Cabs</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Fair Proportional Stop Fares</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Digital Confirmation</li>
            </ul>
          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS: PASSENGER VS DRIVER ================= */}
      <section className="py-16 bg-slate-100/60 border-y border-slate-200">
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900">How It Works in 3 Easy Steps</h2>
            <p className="text-slate-500 text-sm">Whether you need a ride or have empty seats in your car.</p>

            {/* Toggle */}
            <div className="inline-flex p-1 bg-white rounded-2xl border border-slate-200 shadow-sm mt-3">
              <button
                type="button"
                onClick={() => setHowTab('passenger')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  howTab === 'passenger' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Passengers
              </button>
              <button
                type="button"
                onClick={() => setHowTab('driver')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  howTab === 'driver' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Car Owners / Drivers
              </button>
            </div>
          </div>

          {/* Passenger Flow */}
          {howTab === 'passenger' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-800 font-black text-lg flex items-center justify-center mx-auto">1</div>
                <h4 className="font-extrabold text-base text-slate-900">Search Your Route</h4>
                <p className="text-xs text-slate-500">Enter departure city, destination, and travel date to browse dozens of verified co-travelers.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-800 font-black text-lg flex items-center justify-center mx-auto">2</div>
                <h4 className="font-extrabold text-base text-slate-900">Book Your Seat</h4>
                <p className="text-xs text-slate-500">Pick your preferred driver, check car amenities (AC, luggage, ratings), and confirm instantly.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-800 font-black text-lg flex items-center justify-center mx-auto">3</div>
                <h4 className="font-extrabold text-base text-slate-900">Meet &amp; Travel Safely</h4>
                <p className="text-xs text-slate-500">Meet at the agreed pickup spot, track your trip in real time, and enjoy a comfortable ride.</p>
              </div>
            </div>
          )}

          {/* Driver Flow */}
          {howTab === 'driver' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mx-auto">1</div>
                <h4 className="font-extrabold text-base text-slate-900">Post in 3 Steps</h4>
                <p className="text-xs text-slate-500">Select where you are driving, departure time, and available empty passenger seats.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mx-auto">2</div>
                <h4 className="font-extrabold text-base text-slate-900">Accept Bookings</h4>
                <p className="text-xs text-slate-500">Verified passengers request seats or book instantly. Review passenger profiles in one tap.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mx-auto">3</div>
                <h4 className="font-extrabold text-base text-slate-900">Recover Fuel &amp; Tolls</h4>
                <p className="text-xs text-slate-500">Drive your planned route and collect cash or digital payments to cover up to 100% of costs.</p>
              </div>
            </div>
          )}

        </div>

      </section>

      {/* ================= DRIVER CALL TO ACTION BANNER ================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider">
              Driving Somewhere Soon?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Turn Empty Car Seats Into Fuel Money.
            </h2>
            <p className="text-cyan-100 text-sm sm:text-base leading-relaxed">
              Don't travel alone and pay for all the fuel and highway tolls. Share your ride with verified travelers in under 45 seconds!
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => navigate('/publish')}
              className="px-8 py-5 bg-white hover:bg-slate-50 text-slate-900 font-black text-sm uppercase tracking-wider rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Car className="w-5 h-5 text-cyan-600" />
              <span>Offer a Ride Now &rarr;</span>
            </button>
          </div>

        </div>

      </section>

      {/* ================= VERIFIED REVIEWS ================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-extrabold text-cyan-600 uppercase tracking-wider">Community Stories</div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Loved by 120,000+ Co-Travelers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic">"{rev.quote}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-extrabold text-slate-900">{rev.name}</div>
                  <div className="text-xs text-slate-400">{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center text-white font-black text-lg">
                  RB
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight">Rides</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                India's trusted intercity carpooling network. Connecting commuters, professionals, and students for safe, affordable shared journeys.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-300">Top Routes</div>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li><button onClick={() => selectQuickRoute('Chennai', 'Bengaluru')} className="hover:text-cyan-400 cursor-pointer">Chennai &rarr; Bengaluru</button></li>
                <li><button onClick={() => selectQuickRoute('Mumbai', 'Pune')} className="hover:text-cyan-400 cursor-pointer">Mumbai &rarr; Pune</button></li>
                <li><button onClick={() => selectQuickRoute('Bengaluru', 'Hyderabad')} className="hover:text-cyan-400 cursor-pointer">Bengaluru &rarr; Hyderabad</button></li>
                <li><button onClick={() => selectQuickRoute('Delhi', 'Jaipur')} className="hover:text-cyan-400 cursor-pointer">Delhi &rarr; Jaipur</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-300">Quick Links</div>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li><button onClick={() => navigate('/search')} className="hover:text-cyan-400 cursor-pointer">Find a Ride</button></li>
                <li><button onClick={() => navigate('/publish')} className="hover:text-cyan-400 cursor-pointer">Offer a Ride</button></li>
                <li><button onClick={() => navigate('/how-it-works')} className="hover:text-cyan-400 cursor-pointer">How It Works</button></li>
                <li><button onClick={() => navigate('/safety')} className="hover:text-cyan-400 cursor-pointer">Safety Guidelines</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-300">Trust &amp; Safety</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aadhaar &amp; Driving License verification on all drivers. 24/7 emergency SOS support for every journey.
              </p>
              <div className="pt-2 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Verified Community</span>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} RB Rides Technologies. All rights reserved. Travel Smart &bull; Save More &bull; Connect India.
          </div>

        </div>
      </footer>

    </div>
  );
}
