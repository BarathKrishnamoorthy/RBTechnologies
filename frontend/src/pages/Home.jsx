import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Navigation, 
  ArrowLeftRight, 
  Calendar, 
  Users, 
  Search, 
  ShieldCheck, 
  Zap, 
  Wind, 
  Star, 
  Sparkles, 
  ChevronDown, 
  Plus, 
  Minus,
  CheckCircle2,
  TrendingUp,
  Car,
  BadgePercent,
  Wallet,
  Clock,
  ArrowRight,
  UserCheck,
  ChevronRight,
  DollarSign,
  Award
} from 'lucide-react';

const INDIAN_CITIES = [
  { city: 'Chennai', state: 'Tamil Nadu', hubs: 'Koyambedu, Guindy, Airport' },
  { city: 'Bengaluru', state: 'Karnataka', hubs: 'Silk Board, Majestic, Electronic City' },
  { city: 'Mumbai', state: 'Maharashtra', hubs: 'Dadar, Vashi, Borivali' },
  { city: 'Pune', state: 'Maharashtra', hubs: 'Wakad, Shivajinagar, Hinjewadi' },
  { city: 'Hyderabad', state: 'Telangana', hubs: 'Gachibowli, Ameerpet, Hitec City' },
  { city: 'Delhi', state: 'NCR', hubs: 'Connaught Place, Kashmere Gate, Noida' },
  { city: 'Jaipur', state: 'Rajasthan', hubs: 'Sindhi Camp, Malviya Nagar' },
  { city: 'Coimbatore', state: 'Tamil Nadu', hubs: 'Gandhipuram, Hope College' },
];

const TRENDING_CORRIDORS = [
  { from: 'Chennai', to: 'Bengaluru', price: 400, regularPrice: 1600, duration: '5h 15m' },
  { from: 'Mumbai', to: 'Pune', price: 350, regularPrice: 1200, duration: '3h 10m' },
  { from: 'Bengaluru', to: 'Hyderabad', price: 650, regularPrice: 2200, duration: '8h 00m' },
  { from: 'Delhi', to: 'Jaipur', price: 450, regularPrice: 1500, duration: '4h 45m' },
  { from: 'Coimbatore', to: 'Chennai', price: 500, regularPrice: 1750, duration: '7h 10m' },
];

const FEATURED_LIVE_RIDES = [
  {
    id: 'ride-1',
    driver: 'Rajesh K.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    reviews: 42,
    origin: 'Chennai',
    originLoc: 'Koyambedu Omni Bus Stand',
    destination: 'Bengaluru',
    destLoc: 'Silk Board / Electronic City',
    date: 'Today',
    time: '04:00 PM',
    price: 450,
    seatsLeft: 2,
    car: 'Innova Crysta (AC)',
    instant: true,
  },
  {
    id: 'ride-2',
    driver: 'Priya Sundaram',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5.0,
    reviews: 28,
    origin: 'Mumbai',
    originLoc: 'Bandra Kurla Complex (BKC)',
    destination: 'Pune',
    destLoc: 'Wakad Flyover / Hinjewadi',
    date: 'Tomorrow',
    time: '07:30 AM',
    price: 350,
    seatsLeft: 3,
    car: 'Honda City (AC)',
    instant: true,
  },
  {
    id: 'ride-3',
    driver: 'Amit Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    reviews: 65,
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
    quote: 'As a car owner driving Mumbai-Pune twice a week, I easily offset ₹10,000+ in fuel and expressway tolls each month. The publishing process is incredibly fast.',
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
  
  // Passenger Search State
  const [fromCity, setFromCity] = useState('Chennai');
  const [toCity, setToCity] = useState('Bengaluru');
  const [travelDate, setTravelDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [seats, setSeats] = useState(1);
  
  // Driver Offer State
  const [vehicleType, setVehicleType] = useState('Sedan (AC)');
  const [emptySeats, setEmptySeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(400);

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState(null); // 'from' | 'to' | 'seats' | null
  const [isSwapping, setIsSwapping] = useState(false);
  const [toast, setToast] = useState('');

  const widgetRef = useRef(null);

  // Commute Savings Calculator State
  const [commuteDist, setCommuteDist] = useState(120);
  const [commuteDays, setCommuteDays] = useState(4);

  // How it works tab state ('passenger' | 'driver')
  const [howTab, setHowTab] = useState('passenger');

  // Helper to format date cleanly so it never truncates
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Select Date';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const target = new Date(y, m - 1, d);
      const today = new Date();
      
      const isToday =
        target.getDate() === today.getDate() &&
        target.getMonth() === today.getMonth() &&
        target.getFullYear() === today.getFullYear();

      const options = { day: 'numeric', month: 'short', weekday: 'short' };
      const formatted = target.toLocaleDateString('en-US', options); // e.g. "Fri, Oct 16"
      
      return isToday ? `Today, ${target.getDate()} ${target.toLocaleDateString('en-US', { month: 'short' })}` : formatted;
    } catch {
      return dateStr;
    }
  };

  // Click outside listener for dropdown popovers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  const handleSwapCities = (e) => {
    e.stopPropagation();
    setIsSwapping(true);
    const prevFrom = fromCity;
    setFromCity(toCity);
    setToCity(prevFrom);
    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleSelectCorridor = (route) => {
    setFromCity(route.from);
    setToCity(route.to);
    setPricePerSeat(route.price);
    triggerToast(`Applied Corridor: ${route.from} ➔ ${route.to} (₹${route.price})`);
    if (onSearch) {
      onSearch({ origin: route.from, destination: route.to, date: travelDate, seats });
    }
  };

  const handleSearchAction = (e) => {
    e.preventDefault();
    if (!fromCity || !toCity) {
      triggerToast('Please select origin and destination.');
      return;
    }
    if (activeTab === 'find') {
      if (onSearch) {
        onSearch({ origin: fromCity, destination: toCity, date: travelDate, seats, vehicleType });
      } else {
        navigate(`/search?origin=${encodeURIComponent(fromCity)}&destination=${encodeURIComponent(toCity)}&date=${travelDate}&seats=${seats}`);
      }
    } else {
      navigate('/publish', {
        state: {
          origin: fromCity,
          destination: toCity,
          departureDate: travelDate,
          seatsAvailable: seats,
          vehicleType
        }
      });
    }
  };


  // Calculator Savings
  const monthlySavings = useMemo(() => {
    const monthlyKm = commuteDist * commuteDays * 4;
    const soloCost = monthlyKm * 7.5;
    const carpoolCost = monthlyKm * 2.5;
    return Math.round(soloCost - carpoolCost);
  }, [commuteDist, commuteDays]);

  const fuelSavedLitres = Math.round((commuteDist * commuteDays * 4) / 14);
  const co2OffsetKg = Math.round(fuelSavedLitres * 2.3);

  return (
    <div className="relative min-h-screen w-full bg-[#FAF9FF] text-slate-800 flex flex-col justify-between overflow-x-hidden font-sans selection:bg-purple-100 selection:text-purple-900">
      
      {/* ================= HERO SECTION (WHITE WITH PURPLE THEME) ================= */}
      <section className="relative w-full overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        
        {/* Dynamic Purple Ambient Glows & Dot Grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Soft Violet Top Gradient Orb */}
          <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-purple-200/60 via-violet-100/40 to-transparent blur-[120px] rounded-full" />
          
          {/* Ambient Side Accents */}
          <div className="absolute top-1/4 -left-40 w-[450px] h-[450px] bg-purple-100/70 blur-[110px] rounded-full" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-100/60 blur-[120px] rounded-full" />

          {/* Crisp Dot Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotPattern" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="#8B5CF6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>

          {/* Curving Highway Streamlines (Soft Purple Theme) */}
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="purpleFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path 
              d="M -150 280 C 250 120, 650 560, 1350 240 C 1750 60, 2050 420, 2300 280" 
              stroke="url(#purpleFlow)" 
              strokeWidth="2.5" 
              strokeDasharray="8 8" 
              fill="none" 
            />
            <path 
              d="M -80 380 C 380 260, 750 480, 1250 360 C 1600 280, 1900 480, 2200 400" 
              stroke="url(#purpleFlow)" 
              strokeWidth="1.5" 
              strokeDasharray="4 6" 
              fill="none" 
            />
          </svg>
        </div>

        {/* Floating Toast Notification */}
        {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white text-purple-900 border border-purple-200/80 shadow-[0_12px_32px_rgba(124,58,237,0.18)] text-xs sm:text-sm font-semibold backdrop-blur-md animate-bounce-short">
            <Sparkles className="w-4 h-4 text-purple-600 fill-purple-100" />
            <span>{toast}</span>
          </div>
        )}

        {/* Hero Section Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          
          {/* Top Community Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50/90 border border-purple-200/90 text-purple-800 shadow-[0_4px_16px_rgba(139,92,246,0.1)] mb-6 hover:bg-purple-100/80 hover:border-purple-300 transition-all cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-purple-600 animate-ping" />
            <span className="text-xs sm:text-sm font-semibold tracking-tight">
              Over <span className="text-purple-900 font-extrabold underline decoration-purple-300 underline-offset-2">120,000+ Trips</span> Shared Across 80+ Indian Cities
            </span>
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-[1.12]">
            Travel Together.{' '}
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
              Save Up to 70% on Every Trip.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
            Connect with verified co-travelers and empty car seats heading your way. Safe, budget-friendly, and air-conditioned city-to-city carpooling.
          </p>

          {/* Ride Mode Switcher Pill */}
          <div className="mt-7 flex items-center p-1.5 rounded-full bg-purple-100/60 border border-purple-200/70 shadow-inner backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab('find')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'find'
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-[0_4px_18px_rgba(124,58,237,0.35)] scale-[1.02]'
                  : 'text-slate-600 hover:text-purple-900 hover:bg-purple-200/50'
              }`}
            >
              <Search className="w-4 h-4" />
              Find a Ride
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('offer')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'offer'
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-[0_4px_18px_rgba(124,58,237,0.35)] scale-[1.02]'
                  : 'text-slate-600 hover:text-purple-900 hover:bg-purple-200/50'
              }`}
            >
              <Car className="w-4 h-4" />
              Offer a Ride
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                activeTab === 'offer'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-300/80'
              }`}>
                Earn ₹
              </span>
            </button>
          </div>

          {/* Search & Booking Elevated White Card */}
          <div ref={widgetRef} className="mt-6 w-full max-w-5xl relative">
            
            {/* Subtle Outer Purple Glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-400/20 via-violet-300/15 to-indigo-400/20 rounded-3xl blur-xl opacity-75 pointer-events-none" />

            {/* Core White Card */}
            <div className="relative bg-white/95 backdrop-blur-xl border border-purple-100/90 rounded-3xl p-3 sm:p-4 shadow-[0_20px_50px_-15px_rgba(124,58,237,0.12)]">
              
              {/* FIND A RIDE MODE */}
              {activeTab === 'find' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-2.5 sm:gap-3">
                  
                  {/* 1. Origin & Destination with Centered Swap Icon (lg:col-span-5) */}
                  <div className="lg:col-span-5 relative grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    
                    {/* Origin Box */}
                    <div className="relative">
                      <div
                        onClick={() => setActiveDropdown(activeDropdown === 'from' ? null : 'from')}
                        className={`group flex items-center gap-3 px-3.5 h-[68px] rounded-2xl cursor-pointer text-left transition-all ${
                          activeDropdown === 'from'
                            ? 'bg-purple-50/80 ring-2 ring-purple-600 border-transparent'
                            : 'bg-slate-50/70 hover:bg-purple-50/40 border border-slate-200/90 hover:border-purple-300'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-100/90 flex items-center justify-center text-purple-700 flex-shrink-0 group-hover:scale-105 transition-transform">
                          <Navigation className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div className="overflow-hidden flex-1 min-w-0">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight mb-0.5">Leaving From</span>
                          <span className="block text-sm font-bold text-slate-800 truncate">{fromCity}</span>
                        </div>
                      </div>

                      {/* Origin Autocomplete Dropdown */}
                      {activeDropdown === 'from' && (
                        <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white border border-purple-100 rounded-2xl shadow-[0_20px_45px_rgba(124,58,237,0.18)] z-50 p-2 text-left animate-in fade-in zoom-in-95">
                          <div className="px-3 py-1.5 text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                            Popular Pickup Cities
                          </div>
                          <div className="max-h-60 overflow-y-auto space-y-1">
                            {INDIAN_CITIES.map((c) => (
                              <button
                                key={c.city}
                                type="button"
                                onClick={() => {
                                  setFromCity(c.city);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full flex flex-col px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                                  fromCity === c.city ? 'bg-purple-100/70 text-purple-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between text-sm font-bold">
                                  <span>{c.city}</span>
                                  <span className="text-[11px] text-slate-400 font-normal">{c.state}</span>
                                </div>
                                <span className="text-[11px] text-slate-500 truncate">{c.hubs}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Desktop Floating Center Swap Button */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden sm:flex">
                      <button
                        type="button"
                        title="Swap Origin and Destination"
                        onClick={handleSwapCities}
                        className="p-1.5 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400 hover:text-purple-900 shadow-md hover:shadow-lg transition-all active:scale-90 cursor-pointer"
                      >
                        <ArrowLeftRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isSwapping ? 'rotate-180 scale-110 text-purple-950' : ''}`} />
                      </button>
                    </div>

                    {/* Destination Box */}
                    <div className="relative">
                      <div
                        onClick={() => setActiveDropdown(activeDropdown === 'to' ? null : 'to')}
                        className={`group flex items-center gap-3 px-3.5 h-[68px] rounded-2xl cursor-pointer text-left transition-all ${
                          activeDropdown === 'to'
                            ? 'bg-purple-50/80 ring-2 ring-purple-600 border-transparent'
                            : 'bg-slate-50/70 hover:bg-purple-50/40 border border-slate-200/90 hover:border-purple-300'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-violet-100/90 flex items-center justify-center text-violet-700 flex-shrink-0 group-hover:scale-105 transition-transform">
                          <MapPin className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div className="overflow-hidden flex-1 min-w-0">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight mb-0.5">Going To</span>
                          <span className="block text-sm font-bold text-slate-800 truncate">{toCity}</span>
                        </div>
                      </div>

                      {/* Destination Autocomplete Dropdown */}
                      {activeDropdown === 'to' && (
                        <div className="absolute right-0 sm:left-0 top-full mt-2 w-72 sm:w-80 bg-white border border-purple-100 rounded-2xl shadow-[0_20px_45px_rgba(124,58,237,0.18)] z-50 p-2 text-left animate-in fade-in zoom-in-95">
                          <div className="px-3 py-1.5 text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                            Popular Dropoff Cities
                          </div>
                          <div className="max-h-60 overflow-y-auto space-y-1">
                            {INDIAN_CITIES.map((c) => (
                              <button
                                key={c.city}
                                type="button"
                                onClick={() => {
                                  setToCity(c.city);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full flex flex-col px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                                  toCity === c.city ? 'bg-purple-100/70 text-purple-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between text-sm font-bold">
                                  <span>{c.city}</span>
                                  <span className="text-[11px] text-slate-400 font-normal">{c.state}</span>
                                </div>
                                <span className="text-[11px] text-slate-500 truncate">{c.hubs}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* 2. Travel Date (lg:col-span-3) - Full Readable Date without browser clipping */}
                  <div className="lg:col-span-3 relative">
                    <div className="relative flex items-center gap-3 px-3.5 h-[68px] rounded-2xl bg-slate-50/70 hover:bg-purple-50/40 border border-slate-200/90 hover:border-purple-300 transition-all cursor-pointer">
                      <div className="w-9 h-9 rounded-xl bg-purple-100/90 flex items-center justify-center text-purple-700 flex-shrink-0">
                        <Calendar className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div className="flex-1 overflow-hidden text-left min-w-0">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight mb-0.5">Date</span>
                        <span className="block text-sm font-bold text-slate-800 truncate whitespace-nowrap">
                          {formatDisplayDate(travelDate)}
                        </span>
                      </div>

                      {/* Invisible Native Input Overlaid on Top so clicking opens native calendar */}
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        aria-label="Select Date"
                      />
                    </div>
                  </div>

                  {/* 3. Passengers / Seats (lg:col-span-2) - Clear text without ellipsis */}
                  <div className="relative lg:col-span-2">
                    <div
                      onClick={() => setActiveDropdown(activeDropdown === 'seats' ? null : 'seats')}
                      className={`flex items-center justify-between gap-2 px-3.5 h-[68px] rounded-2xl cursor-pointer transition-all ${
                        activeDropdown === 'seats'
                          ? 'bg-purple-50/80 ring-2 ring-purple-600 border-transparent'
                          : 'bg-slate-50/70 hover:bg-purple-50/40 border border-slate-200/90 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-purple-100/90 flex items-center justify-center text-purple-700 flex-shrink-0">
                          <Users className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div className="text-left overflow-hidden">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight mb-0.5">Seats</span>
                          <span className="block text-sm font-bold text-slate-800 whitespace-nowrap">
                            {seats} {seats === 1 ? 'Seat' : 'Seats'}
                          </span>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </div>

                    {/* Seat Counter Popover */}
                    {activeDropdown === 'seats' && (
                      <div className="absolute right-0 md:left-1/2 md:-translate-x-1/2 top-full mt-2 w-56 bg-white border border-purple-100 rounded-2xl shadow-[0_20px_45px_rgba(124,58,237,0.18)] z-50 p-3 text-left animate-in fade-in zoom-in-95">
                        <span className="block text-xs font-bold text-slate-500 mb-2">Number of Passengers</span>
                        <div className="flex items-center justify-between bg-purple-50/70 rounded-xl p-2.5 border border-purple-200/60">
                          <button
                            type="button"
                            disabled={seats <= 1}
                            onClick={() => setSeats((prev) => Math.max(1, prev - 1))}
                            className="p-1.5 rounded-lg bg-white border border-purple-200 text-purple-800 hover:bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-extrabold text-purple-950">
                            {seats} {seats === 1 ? 'Seat' : 'Seats'}
                          </span>
                          <button
                            type="button"
                            disabled={seats >= 6}
                            onClick={() => setSeats((prev) => Math.min(6, prev + 1))}
                            className="p-1.5 rounded-lg bg-white border border-purple-200 text-purple-800 hover:bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. Find Rides CTA (lg:col-span-2) */}
                  <div className="lg:col-span-2">
                    <button
                      type="button"
                      onClick={handleSearchAction}
                      className="w-full h-[68px] flex items-center justify-center gap-2 px-4 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-[0_8px_24px_rgba(124,58,237,0.35)] hover:shadow-[0_12px_30px_rgba(124,58,237,0.45)] active:scale-[0.98] transition-all group cursor-pointer"
                    >
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform stroke-[2.5]" />
                      <span className="whitespace-nowrap">Find Rides</span>
                    </button>
                  </div>

                </div>
              )}

              {/* OFFER A RIDE MODE (DRIVER ADAPTIVE INTERFACE) */}
              {activeTab === 'offer' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2.5 sm:gap-3">
                    
                    {/* Origin */}
                    <div className="md:col-span-3 text-left">
                      <div className="flex items-center gap-3 px-3.5 h-[68px] rounded-2xl bg-slate-50/70 border border-slate-200/90">
                        <div className="w-9 h-9 rounded-xl bg-purple-100/90 flex items-center justify-center text-purple-700 flex-shrink-0">
                          <Navigation className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div className="overflow-hidden flex-1 min-w-0">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight mb-0.5">Pick-up City</span>
                          <input 
                            type="text" 
                            value={fromCity} 
                            onChange={(e) => setFromCity(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-800 w-full focus:outline-none"
                            placeholder="Leaving from"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="md:col-span-3 text-left">
                      <div className="flex items-center gap-3 px-3.5 h-[68px] rounded-2xl bg-slate-50/70 border border-slate-200/90">
                        <div className="w-9 h-9 rounded-xl bg-violet-100/90 flex items-center justify-center text-violet-700 flex-shrink-0">
                          <MapPin className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div className="overflow-hidden flex-1 min-w-0">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight mb-0.5">Destination</span>
                          <input 
                            type="text" 
                            value={toCity} 
                            onChange={(e) => setToCity(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-800 w-full focus:outline-none"
                            placeholder="Going to"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Car Type */}
                    <div className="md:col-span-2 text-left">
                      <div className="flex flex-col justify-center px-3.5 h-[68px] rounded-2xl bg-slate-50/70 border border-slate-200/90">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight mb-0.5">Vehicle</span>
                        <select
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value)}
                          className="bg-transparent text-sm font-bold text-slate-800 focus:outline-none w-full cursor-pointer"
                        >
                          <option>Sedan (AC)</option>
                          <option>Hatchback</option>
                          <option>SUV / Innova</option>
                          <option>Motorcycle / Bike</option>
                          <option>Van / Traveller</option>
                        </select>
                      </div>
                    </div>

                    {/* Empty Seats Offered */}
                    <div className="md:col-span-2 text-left">
                      <div className="flex items-center justify-between px-3.5 h-[68px] rounded-2xl bg-slate-50/70 border border-slate-200/90">
                        <div className="text-left">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight mb-0.5">Empty Seats</span>
                          <span className="text-sm font-bold text-slate-800">{emptySeats} Seats</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEmptySeats(Math.max(1, emptySeats - 1))}
                            className="p-1 rounded-lg bg-white text-purple-700 shadow-sm border border-slate-200 hover:bg-purple-50 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEmptySeats(Math.min(14, emptySeats + 1))}
                            className="p-1 rounded-lg bg-white text-purple-700 shadow-sm border border-slate-200 hover:bg-purple-50 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Publish Ride CTA */}
                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleSearchAction}
                        className="w-full h-[68px] rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-[0_8px_24px_rgba(124,58,237,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Publish</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Driver Earnings Live Preview Banner */}
                  <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2.5 rounded-2xl bg-purple-50/80 border border-purple-200/60 text-xs text-purple-900 font-semibold">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-purple-700" />
                      <span>Estimated Fuel Share Recovered:</span>
                      <span className="text-sm font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        ₹{emptySeats * pricePerSeat}
                      </span>
                      <span className="text-slate-500 font-normal">(@ ₹{pricePerSeat}/seat)</span>
                    </div>
                    <span className="text-purple-600 mt-1 sm:mt-0 font-medium">✓ Instant direct bank payout after drop-off</span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Trending Corridors Section (Upgraded White & Purple Pills) */}
          <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-4xl">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
              <span>Popular Low-Fare Corridors (Click to Auto-fill):</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {TRENDING_CORRIDORS.map((route, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectCorridor(route)}
                  className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-purple-50/80 border border-purple-200/70 hover:border-purple-400 text-slate-700 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <span className="text-xs font-semibold text-slate-800">
                    {route.from} <span className="text-purple-600 font-bold">➔</span> {route.to}
                  </span>
                  <span className="text-xs font-extrabold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800">
                    ₹{route.price}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    ₹{route.regularPrice}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Trust & Social Proof Badges */}
          <div className="mt-12 pt-7 border-t border-purple-100/90 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center justify-center gap-2 text-slate-700 text-xs sm:text-sm font-semibold">
              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Government ID Verified</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-700 text-xs sm:text-sm font-semibold">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-700 text-xs sm:text-sm font-semibold">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 flex-shrink-0">
                <Wind className="w-4 h-4" />
              </div>
              <span>100% AC &amp; Sanitized</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-700 text-xs sm:text-sm font-semibold">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <span>4.9/5 from 45k+ Ratings</span>
            </div>
          </div>

        </div>

      </section>

      {/* ================= KEY METRICS COUNTER ================= */}
      <section className="relative -mt-6 max-w-6xl mx-auto px-4 z-20 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-[0_12px_35px_rgba(124,58,237,0.08)] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">120K+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-600/70">Verified Rides Shared</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-purple-700 tracking-tight">₹4.2 Cr</div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-600/70">Saved by Co-Travelers</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-500 tracking-tight">4.95 ★</div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-600/70">Average Driver Rating</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">100%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-600/70">Govt ID &amp; DL Verified</div>
          </div>

        </div>
      </section>

      {/* ================= LIVE FEATURED RIDES SECTION ================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              Real-Time Available Rides
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Departing Soon Near You
            </h2>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="group flex items-center gap-2 text-purple-700 hover:text-purple-900 font-extrabold text-sm transition-colors cursor-pointer"
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
              className="bg-white rounded-3xl p-6 border border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-[0_20px_40px_rgba(124,58,237,0.12)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-5">
                
                {/* Header: Date + Price */}
                <div className="flex items-center justify-between pb-4 border-b border-purple-50">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 font-bold text-xs border border-purple-100">
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
                    <div className="text-[10px] font-bold text-purple-600/70 uppercase">per seat</div>
                  </div>
                </div>

                {/* Route Visualizer */}
                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full" />
                  
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
                <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={ride.avatar}
                      alt={ride.driver}
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                    />
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        {ride.driver}
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
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
                    <div className="text-[11px] text-purple-600/70 font-medium">{ride.car}</div>
                  </div>
                </div>

              </div>

              {/* Card Footer Button */}
              <div className="pt-5">
                <button
                  type="button"
                  className="w-full py-3 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
      <section className="py-16 bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950 text-white relative overflow-hidden w-full">
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/30">
              <DollarSign className="w-3.5 h-3.5 text-purple-400" />
              Fuel Savings Estimator
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              See How Much You Save Every Month
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Slide to adjust your typical one-way travel distance and frequency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 border border-purple-500/20 rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
            
            {/* Sliders Column */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Distance Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-300">One-Way Trip Distance</span>
                  <span className="text-purple-300 font-black text-lg">{commuteDist} km</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="400"
                  step="10"
                  value={commuteDist}
                  onChange={(e) => setCommuteDist(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-2 bg-white/20 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                  <span>30 km (Nearby city)</span>
                  <span>200 km (Intercity)</span>
                  <span>400 km (Interstate)</span>
                </div>
              </div>

              {/* Days Per Week Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-300">Travel Frequency</span>
                  <span className="text-purple-300 font-black text-lg">{commuteDays} trips / week</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={commuteDays}
                  onChange={(e) => setCommuteDays(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-2 bg-white/20 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                  <span>1 trip (Weekend)</span>
                  <span>3-4 trips (Hybrid)</span>
                  <span>7 trips (Daily)</span>
                </div>
              </div>

            </div>

            {/* Savings Output Cards Column */}
            <div className="lg:col-span-5 bg-gradient-to-br from-purple-700 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
              
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-purple-200">Estimated Monthly Savings</span>
                <div className="text-4xl sm:text-5xl font-black mt-1">₹{monthlySavings.toLocaleString()}</div>
                <p className="text-xs text-purple-200 mt-1">Compared to driving solo or booking private cabs</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                <div>
                  <div className="text-xs text-purple-200 font-bold uppercase">Fuel Saved</div>
                  <div className="text-2xl font-black mt-0.5">~{fuelSavedLitres} L</div>
                  <div className="text-[10px] text-purple-200">petrol / diesel</div>
                </div>

                <div>
                  <div className="text-xs text-purple-200 font-bold uppercase">CO₂ Prevented</div>
                  <div className="text-2xl font-black mt-0.5">{co2OffsetKg} kg</div>
                  <div className="text-[10px] text-purple-200">cleaner air 🌱</div>
                </div>
              </div>

              <button
                onClick={() => navigate('/publish')}
                className="w-full py-3.5 bg-white hover:bg-purple-50 text-purple-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Saving &bull; Offer a Ride</span>
                <ArrowRight className="w-4 h-4 text-purple-700" />
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ================= BENTO GRID: WHY CHOOSE RB RIDES ================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-purple-600" />
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
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">100% ID Verified Community</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Every driver and passenger is verified with Government ID (Aadhaar/PAN) and Driving License before publishing or booking.
            </p>
            <ul className="text-xs font-bold text-slate-700 space-y-1.5 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Government ID Verified</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Driving License Verification</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Community Star Ratings</li>
            </ul>
          </div>

          {/* Bento 2: Live Tracking */}
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Real-Time Live GPS Tracking</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Share real-time tracking links with family and friends with one tap. Watch your car's progress on interactive maps with live ETA.
            </p>
            <ul className="text-xs font-bold text-slate-700 space-y-1.5 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Live Vehicle GPS Stream</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> 1-Tap WhatsApp Share</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> In-App SOS Emergency Help</li>
            </ul>
          </div>

          {/* Bento 3: Transparent Pricing */}
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Zero Surge &bull; Fixed Pricing</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              No festival surge, rain multipliers, or hidden fees. Fares are fixed fairly per seat based on distance, keeping journeys predictable.
            </p>
            <ul className="text-xs font-bold text-slate-700 space-y-1.5 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Up to 70% Cheaper than Cabs</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Fair Proportional Stop Fares</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600" /> Instant Digital Confirmation</li>
            </ul>
          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS: PASSENGER VS DRIVER ================= */}
      <section className="py-16 bg-purple-50/40 border-y border-purple-100 w-full">
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900">How It Works in 3 Easy Steps</h2>
            <p className="text-slate-500 text-sm">Whether you need a ride or have empty seats in your car.</p>

            {/* Toggle */}
            <div className="inline-flex p-1 bg-white rounded-2xl border border-purple-200 shadow-sm mt-3">
              <button
                type="button"
                onClick={() => setHowTab('passenger')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  howTab === 'passenger' ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Passengers
              </button>
              <button
                type="button"
                onClick={() => setHowTab('driver')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  howTab === 'driver' ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Car Owners / Drivers
              </button>
            </div>
          </div>

          {/* Passenger Flow */}
          {howTab === 'passenger' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-800 font-black text-lg flex items-center justify-center mx-auto">1</div>
                <h4 className="font-extrabold text-base text-slate-900">Search Your Route</h4>
                <p className="text-xs text-slate-500">Enter departure city, destination, and travel date to browse dozens of verified co-travelers.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-800 font-black text-lg flex items-center justify-center mx-auto">2</div>
                <h4 className="font-extrabold text-base text-slate-900">Book Your Seat</h4>
                <p className="text-xs text-slate-500">Pick your preferred driver, check car amenities (AC, luggage, ratings), and confirm instantly.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-800 font-black text-lg flex items-center justify-center mx-auto">3</div>
                <h4 className="font-extrabold text-base text-slate-900">Meet &amp; Travel Safely</h4>
                <p className="text-xs text-slate-500">Meet at the agreed pickup spot, track your trip in real time, and enjoy a comfortable ride.</p>
              </div>
            </div>
          )}

          {/* Driver Flow */}
          {howTab === 'driver' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mx-auto">1</div>
                <h4 className="font-extrabold text-base text-slate-900">Post in 3 Steps</h4>
                <p className="text-xs text-slate-500">Select where you are driving, departure time, and available empty passenger seats.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mx-auto">2</div>
                <h4 className="font-extrabold text-base text-slate-900">Accept Bookings</h4>
                <p className="text-xs text-slate-500">Verified passengers request seats or book instantly. Review passenger profiles in one tap.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mx-auto">3</div>
                <h4 className="font-extrabold text-base text-slate-900">Recover Fuel &amp; Tolls</h4>
                <p className="text-xs text-slate-500">Drive your planned route and collect cash or digital payments to cover up to 100% of costs.</p>
              </div>
            </div>
          )}

        </div>

      </section>

      {/* ================= DRIVER CALL TO ACTION BANNER ================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="bg-gradient-to-r from-purple-700 via-violet-700 to-indigo-800 rounded-3xl p-8 sm:p-14 text-white shadow-[0_20px_50px_rgba(124,58,237,0.25)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider border border-white/20">
              Driving Somewhere Soon?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Turn Empty Car Seats Into Fuel Money.
            </h2>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              Don't travel alone and pay for all the fuel and highway tolls. Share your ride with verified travelers in under 45 seconds!
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => navigate('/publish')}
              className="px-8 py-5 bg-white hover:bg-purple-50 text-purple-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Car className="w-5 h-5 text-purple-700" />
              <span>Offer a Ride Now &rarr;</span>
            </button>
          </div>

        </div>

      </section>

      {/* ================= VERIFIED REVIEWS ================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-extrabold text-purple-700 uppercase tracking-wider">Community Stories</div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Loved by 120,000+ Co-Travelers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic">"{rev.quote}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-purple-50">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-200"
                />
                <div>
                  <div className="text-sm font-extrabold text-slate-900">{rev.name}</div>
                  <div className="text-xs text-purple-600/70">{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-purple-900/40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-600/30">
                  RB
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight">Rides</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                India's trusted intercity carpooling network. Connecting commuters, professionals, and students for safe, affordable shared journeys.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-purple-300">Top Routes</div>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li><button onClick={() => { setFromCity('Chennai'); setToCity('Bengaluru'); onSearch && onSearch({ origin: 'Chennai', destination: 'Bengaluru', date: travelDate, seats }); }} className="hover:text-purple-400 cursor-pointer">Chennai &rarr; Bengaluru</button></li>
                <li><button onClick={() => { setFromCity('Mumbai'); setToCity('Pune'); onSearch && onSearch({ origin: 'Mumbai', destination: 'Pune', date: travelDate, seats }); }} className="hover:text-purple-400 cursor-pointer">Mumbai &rarr; Pune</button></li>
                <li><button onClick={() => { setFromCity('Bengaluru'); setToCity('Hyderabad'); onSearch && onSearch({ origin: 'Bengaluru', destination: 'Hyderabad', date: travelDate, seats }); }} className="hover:text-purple-400 cursor-pointer">Bengaluru &rarr; Hyderabad</button></li>
                <li><button onClick={() => { setFromCity('Delhi'); setToCity('Jaipur'); onSearch && onSearch({ origin: 'Delhi', destination: 'Jaipur', date: travelDate, seats }); }} className="hover:text-purple-400 cursor-pointer">Delhi &rarr; Jaipur</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-purple-300">Quick Links</div>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li><button onClick={() => navigate('/search')} className="hover:text-purple-400 cursor-pointer">Find a Ride</button></li>
                <li><button onClick={() => navigate('/publish')} className="hover:text-purple-400 cursor-pointer">Offer a Ride</button></li>
                <li><button onClick={() => navigate('/how-it-works')} className="hover:text-purple-400 cursor-pointer">How It Works</button></li>
                <li><button onClick={() => navigate('/safety')} className="hover:text-purple-400 cursor-pointer">Safety Guidelines</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-purple-300">Trust &amp; Safety</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aadhaar &amp; Driving License verification on all drivers. 24/7 emergency SOS support for every journey.
              </p>
              <div className="pt-2 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Community</span>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} RB Rides Technologies. All rights reserved. Travel Smart &bull; Save More &bull; Connect India.
          </div>

        </div>
      </footer>

    </div>
  );
}
