import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { publishRideAdvanced } from '../api';
import { 
  MapPin, Calendar, Clock, Car, ShieldCheck, CheckCircle2, 
  ArrowRight, ArrowLeftRight, Users, Sparkles, Plus, Trash2, 
  Check, AlertCircle, ChevronRight, ChevronLeft, Zap, Info, Bike, Bus
} from 'lucide-react';
import RouteMap from '../components/RouteMap';
import CityAutocomplete from '../components/CityAutocomplete';
import { getCityCoordinates, calculateRoadDistanceKm, INDIAN_CITIES } from '../data/indianCities';

// Pre-calculated popular Indian highway en-route stop suggestions
const ROUTE_STOP_SUGGESTIONS = {
  'chennai-bengaluru': ['Vellore', 'Ranipet', 'Ambur', 'Vaniyambadi', 'Krishnagiri', 'Hosur'],
  'bengaluru-chennai': ['Hosur', 'Krishnagiri', 'Vaniyambadi', 'Ambur', 'Ranipet', 'Vellore'],
  'chennai-salem': ['Kanchipuram', 'Vellore', 'Ambur', 'Vaniyambadi', 'Dharmapuri'],
  'salem-chennai': ['Dharmapuri', 'Vaniyambadi', 'Ambur', 'Vellore', 'Kanchipuram'],
  'bengaluru-salem': ['Hosur', 'Krishnagiri', 'Dharmapuri'],
  'salem-bengaluru': ['Dharmapuri', 'Krishnagiri', 'Hosur'],
  'salem-coimbatore': ['Sankari', 'Bhavani', 'Perundurai', 'Erode', 'Tirupur'],
  'coimbatore-salem': ['Tirupur', 'Erode', 'Perundurai', 'Bhavani', 'Sankari'],
  'chennai-tiruchirappalli': ['Chengalpattu', 'Tindivanam', 'Villupuram', 'Perambalur'],
  'tiruchirappalli-chennai': ['Perambalur', 'Villupuram', 'Tindivanam', 'Chengalpattu'],
  'chennai-trichy': ['Chengalpattu', 'Tindivanam', 'Villupuram', 'Perambalur'],
  'trichy-chennai': ['Perambalur', 'Villupuram', 'Tindivanam', 'Chengalpattu'],
  'mumbai-pune': ['Navi Mumbai', 'Lonavala', 'Khandala', 'Talegaon', 'Pimpri-Chinchwad'],
  'pune-mumbai': ['Pimpri-Chinchwad', 'Talegaon', 'Lonavala', 'Khandala', 'Navi Mumbai'],
  'delhi-jaipur': ['Gurugram', 'Dharuhera', 'Neemrana', 'Behror', 'Kotputli', 'Shahpura'],
  'jaipur-delhi': ['Shahpura', 'Kotputli', 'Behror', 'Neemrana', 'Dharuhera', 'Gurugram'],
  'bengaluru-hyderabad': ['Chikkaballapur', 'Bagepalli', 'Anantapur', 'Kurnool', 'Mahbubnagar', 'Jadcherla'],
  'hyderabad-bengaluru': ['Jadcherla', 'Mahbubnagar', 'Kurnool', 'Anantapur', 'Bagepalli', 'Chikkaballapur'],
  'chennai-coimbatore': ['Kanchipuram', 'Vellore', 'Ambur', 'Salem', 'Erode', 'Tirupur'],
  'coimbatore-chennai': ['Tirupur', 'Erode', 'Salem', 'Ambur', 'Vellore', 'Kanchipuram'],
  'chennai-madurai': ['Chengalpattu', 'Tindivanam', 'Villupuram', 'Perambalur', 'Tiruchirappalli', 'Dindigul'],
  'madurai-chennai': ['Dindigul', 'Tiruchirappalli', 'Perambalur', 'Villupuram', 'Tindivanam', 'Chengalpattu'],
  'bengaluru-mysore': ['Bidadi', 'Ramanagara', 'Channapatna', 'Maddur', 'Mandya', 'Srirangapatna'],
  'mysore-bengaluru': ['Srirangapatna', 'Mandya', 'Maddur', 'Channapatna', 'Ramanagara', 'Bidadi'],
  'hyderabad-vijayawada': ['Choutuppal', 'Suryapet', 'Kodad', 'Nandigama'],
  'vijayawada-hyderabad': ['Nandigama', 'Kodad', 'Suryapet', 'Choutuppal'],
  'delhi-chandigarh': ['Sonipat', 'Panipat', 'Karnal', 'Kurukshetra', 'Ambala'],
  'chandigarh-delhi': ['Ambala', 'Kurukshetra', 'Karnal', 'Panipat', 'Sonipat'],
  'delhi-agra': ['Faridabad', 'Palwal', 'Mathura', 'Vrindavan'],
  'agra-delhi': ['Mathura', 'Vrindavan', 'Palwal', 'Faridabad'],
  'mumbai-nashik': ['Thane', 'Kalyan', 'Asangaon', 'Igatpuri'],
  'nashik-mumbai': ['Igatpuri', 'Asangaon', 'Kalyan', 'Thane'],
  'chennai-pondicherry': ['Mahabalipuram', 'Kalpakkam', 'Marakkanam'],
  'pondicherry-chennai': ['Marakkanam', 'Kalpakkam', 'Mahabalipuram'],
  'coimbatore-bengaluru': ['Tirupur', 'Erode', 'Salem', 'Dharmapuri', 'Hosur'],
  'bengaluru-coimbatore': ['Hosur', 'Dharmapuri', 'Salem', 'Erode', 'Tirupur'],
  'bengaluru-kochi': ['Hosur', 'Salem', 'Coimbatore', 'Palakkad', 'Thrissur', 'Aluva'],
  'kochi-bengaluru': ['Aluva', 'Thrissur', 'Palakkad', 'Coimbatore', 'Salem', 'Hosur'],
  'ahmedabad-surat': ['Nadiad', 'Anand', 'Vadodara', 'Bharuch', 'Ankleshwar'],
  'surat-ahmedabad': ['Ankleshwar', 'Bharuch', 'Vadodara', 'Anand', 'Nadiad'],
  'pune-goa': ['Shirwal', 'Satara', 'Karad', 'Kolhapur', 'Belagavi', 'Sawantwadi'],
  'goa-pune': ['Sawantwadi', 'Belagavi', 'Kolhapur', 'Karad', 'Satara', 'Shirwal'],
  'bengaluru-mangalore': ['Kunigal', 'Channarayapatna', 'Hassan', 'Sakleshpur', 'Bantwal'],
  'mangalore-bengaluru': ['Bantwal', 'Sakleshpur', 'Hassan', 'Channarayapatna', 'Kunigal'],
  'lucknow-kanpur': ['Unnao', 'Nawabganj'],
  'kanpur-lucknow': ['Nawabganj', 'Unnao'],
  'jaipur-udaipur': ['Kishangarh', 'Ajmer', 'Bhilwara', 'Chittorgarh'],
  'udaipur-jaipur': ['Chittorgarh', 'Bhilwara', 'Ajmer', 'Kishangarh'],
  'coimbatore-kochi': ['Palakkad', 'Thrissur', 'Angamaly', 'Aluva'],
  'kochi-coimbatore': ['Aluva', 'Angamaly', 'Thrissur', 'Palakkad'],
  'madurai-tirunelveli': ['Virudhunagar', 'Sattur', 'Kovilpatti'],
  'tirunelveli-madurai': ['Kovilpatti', 'Sattur', 'Virudhunagar'],
};


// Popular Quick Presets by Vehicle Type
const VEHICLE_CONFIGS = {
  car: {
    label: 'Car',
    icon: Car,
    badge: 'Popular',
    desc: 'Sedan, Hatchback, or SUV',
    defaultSeats: 3,
    maxSeats: 6,
    defaultPricePerKm: 1.5,
    presets: ['Innova Crysta (White)', 'Honda City (Silver)', 'Swift Dzire (White)', 'Hyundai Creta (Grey)', 'Tata Nexon (Blue)', 'Mahindra XUV700'],
    defaultModel: 'Innova Crysta (White)',
    amenities: [
      { id: 'ac', label: 'Air Conditioned', icon: '❄️', default: true },
      { id: 'luggage', label: 'Luggage Allowed', icon: '🧳', default: true },
      { id: 'max2', label: 'Max 2 in Back Seat', icon: '👥', default: true },
    ]
  },
  bike: {
    label: 'Bike',
    icon: Bike,
    badge: 'Fast & Budget',
    desc: 'Motorcycle or Scooter',
    defaultSeats: 1,
    maxSeats: 1,
    defaultPricePerKm: 0.8,
    presets: ['Royal Enfield Classic 350', 'Bajaj Pulsar 150', 'Yamaha FZ-S', 'Honda Activa 6G', 'TVS Apache RTR', 'KTM Duke 250'],
    defaultModel: 'Royal Enfield Classic 350',
    amenities: [
      { id: 'helmet', label: 'Helmet Provided for Pillion', icon: '🪖', default: true },
      { id: 'backpack', label: 'Backpack Space Allowed', icon: '🎒', default: true },
      { id: 'raingear', label: 'Rain Gear Available', icon: '🌧️', default: false },
    ]
  },
  van: {
    label: 'Van / Traveller',
    icon: Bus,
    badge: 'Group Travel',
    desc: 'Tempo Traveller or Minivan',
    defaultSeats: 8,
    maxSeats: 14,
    defaultPricePerKm: 1.2,
    presets: ['Force Traveller (12-Seater)', 'Tata Winger (9-Seater)', 'Mahindra Tourister', 'Toyota HiAce Luxury', 'Tempo Traveller (AC Pushback)'],
    defaultModel: 'Force Traveller (12-Seater)',
    amenities: [
      { id: 'ac', label: 'Air Conditioned', icon: '❄️', default: true },
      { id: 'large_luggage', label: 'Large Luggage Carrier', icon: '🧳', default: true },
      { id: 'pushback', label: 'Pushback Reclining Seats', icon: '💺', default: true },
    ]
  }
};

async function fetchKmBetween(from, to) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=false`;
    const r = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    const d = await r.json();
    if (d.code === 'Ok' && d.routes?.length) {
      return Math.round(d.routes[0].distance / 1000); // meters to km
    }
  } catch {
    // Fallback to accurate road distance calculation
  }
  return calculateRoadDistanceKm(from, to) || 320;
}

async function geocodeCity(city) {
  return await getCityCoordinates(city);
}


export default function PublishRideWizard({ onPublishSuccess, user }) {
  const location = useLocation();
  const initialData = location?.state || {};

  // Current Step: 1: Route & Schedule | 2: Seats & Price | 3: Vehicle & Publish
  const [currentStep, setCurrentStep] = useState(1);

  // VEHICLE TYPE: 'car' | 'bike' | 'van'
  const [vehicleType, setVehicleType] = useState(initialData.vehicleType || 'car');

  // STEP 1 STATE: Route & Schedule
  const [origin, setOrigin] = useState(initialData.origin || 'Chennai');
  const [destination, setDestination] = useState(initialData.destination || 'Bengaluru');
  const [departureDate, setDepartureDate] = useState(() => {
    if (initialData.departureDate) return initialData.departureDate;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [departureTime, setDepartureTime] = useState('06:30');
  const [stops, setStops] = useState([]);
  const [customStopInput, setCustomStopInput] = useState('');
  const [estimatedKm, setEstimatedKm] = useState(345);
  const [calculatingRoute, setCalculatingRoute] = useState(false);

  // STEP 2 STATE: Seats & Price
  const [seatsAvailable, setSeatsAvailable] = useState(initialData.seatsAvailable || 3);
  const [pricePerSeat, setPricePerSeat] = useState(450);
  const [instantBooking, setInstantBooking] = useState(true);


  // STEP 3 STATE: Vehicle & Amenities
  const [vehicleModel, setVehicleModel] = useState('Innova Crysta (White)');
  const [plateNumber, setPlateNumber] = useState('TN 07 RB 9988');
  const [selectedAmenities, setSelectedAmenities] = useState({
    ac: true,
    luggage: true,
    max2: true,
    helmet: true,
    backpack: true,
    raingear: false,
    large_luggage: true,
    pushback: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // When Vehicle Type changes, adapt seats, model, and price
  const handleVehicleTypeChange = (type) => {
    setVehicleType(type);
    const cfg = VEHICLE_CONFIGS[type];
    setSeatsAvailable(cfg.defaultSeats);
    setVehicleModel(cfg.defaultModel);
    
    // Auto adjust price for vehicle
    const suggested = Math.max(type === 'bike' ? 50 : 100, Math.round((estimatedKm * cfg.defaultPricePerKm) / 50) * 50);
    setPricePerSeat(suggested);
  };

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
            const cfg = VEHICLE_CONFIGS[vehicleType];
            const suggested = Math.max(vehicleType === 'bike' ? 50 : 100, Math.round((km * cfg.defaultPricePerKm) / 50) * 50);
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
  }, [origin, destination, vehicleType]);

  const handleSwap = () => {
    const tmp = origin;
    setOrigin(destination);
    setDestination(tmp);
    setStops([]); // reset stops on swap
  };

  // Find en-route stop suggestions based on origin and destination
  const suggestedStopsForRoute = useMemo(() => {
    if (!origin || !destination) return [];
    const origKey = origin.split(',')[0].trim().toLowerCase();
    const destKey = destination.split(',')[0].trim().toLowerCase();
    const key = `${origKey}-${destKey}`;
    if (ROUTE_STOP_SUGGESTIONS[key]) {
      return ROUTE_STOP_SUGGESTIONS[key];
    }
    // Check reverse corridor
    const revKey = `${destKey}-${origKey}`;
    if (ROUTE_STOP_SUGGESTIONS[revKey]) {
      return [...ROUTE_STOP_SUGGESTIONS[revKey]].reverse();
    }

    // Dynamic corridor stop suggestion via coordinates
    const cityA = INDIAN_CITIES.find(c => c.name.toLowerCase() === origKey);
    const cityB = INDIAN_CITIES.find(c => c.name.toLowerCase() === destKey);
    if (cityA && cityB) {
      const [lat1, lon1] = cityA.coords;
      const [lat2, lon2] = cityB.coords;
      const baseDist = Math.hypot(lat2 - lat1, lon2 - lon1);

      const enroute = [];
      for (const c of INDIAN_CITIES) {
        if (c.name.toLowerCase() === origKey || c.name.toLowerCase() === destKey) continue;
        const [cLat, cLon] = c.coords;
        const d1 = Math.hypot(cLat - lat1, cLon - lon1);
        const d2 = Math.hypot(lat2 - cLat, lon2 - cLon);
        // If point lies along the corridor (within 18% ellipse)
        if (d1 + d2 <= baseDist * 1.18 && d1 > 0.05 && d2 > 0.05) {
          enroute.push({ name: c.name, distFromA: d1 });
        }
      }

      if (enroute.length > 0) {
        enroute.sort((a, b) => a.distFromA - b.distFromA);
        return enroute.slice(0, 6).map(e => e.name);
      }
    }

    // Generic popular highway stops fallback
    return ['Vellore', 'Ranipet', 'Ambur', 'Krishnagiri', 'Hosur'];
  }, [origin, destination]);


  const toggleStop = (city) => {
    if (stops.includes(city)) {
      setStops(stops.filter((s) => s !== city));
    } else {
      setStops([...stops, city]);
    }
  };

  const addCustomStop = () => {
    if (!customStopInput.trim()) return;
    const clean = customStopInput.trim();
    if (!stops.includes(clean)) {
      setStops([...stops, clean]);
    }
    setCustomStopInput('');
  };

  const removeStop = (city) => {
    setStops(stops.filter((s) => s !== city));
  };

  // Estimated Travel Duration based on km
  const estimatedHours = Math.max(1, Math.round(estimatedKm / 60));
  const estimatedMinutes = Math.round((estimatedKm % 60) * 0.8);
  const durationText = `${estimatedHours}h ${estimatedMinutes > 0 ? estimatedMinutes + 'm' : ''}`;

  const currentVehicleConfig = VEHICLE_CONFIGS[vehicleType];

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

      const activeAmenitiesList = currentVehicleConfig.amenities
        .filter(a => selectedAmenities[a.id])
        .map(a => a.label);

      if (instantBooking) activeAmenitiesList.push('Instant Booking');

      const savedUser = localStorage.getItem('rb_user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      const resolvedDriverId = user?.id || parsedUser?.id || 'usr-driver1';

      const payload = {
        origin,
        destination,
        origin_address: `${origin} Pickup Point`,
        destination_address: `${destination} City Center`,
        departure_date: departureDate,
        departure_time: departureTime,
        arrival_time: `${(parseInt(departureTime.split(':')[0]) + estimatedHours) % 24}:${departureTime.split(':')[1]}`,
        duration: durationText,
        price: Number(pricePerSeat),
        seats_available: Number(seatsAvailable),
        total_seats: Number(seatsAvailable),
        driver_id: resolvedDriverId,
        driver_name: user?.name || parsedUser?.name || 'Verified Driver',
        driver_phone: user?.phone || parsedUser?.phone || '+91 9876543210',
        driver_avatar: user?.avatar || parsedUser?.avatar || '',
        driver_email: user?.email || parsedUser?.email || '',
        vehicle_type: vehicleType,
        vehicle_model: vehicleModel,
        plate_number: plateNumber,
        has_ac: Boolean(selectedAmenities.ac),
        luggage_allowed: Boolean(selectedAmenities.luggage || selectedAmenities.backpack || selectedAmenities.large_luggage),
        max_2_in_back: Boolean(selectedAmenities.max2),
        city_stops: cityStopsPayload,
        segment_prices: segmentPricesPayload,
        amenities: activeAmenitiesList
      };

      const result = await publishRideAdvanced(payload);
      setSuccess(true);
      setTimeout(() => {
        if (onPublishSuccess) {
          onPublishSuccess(result.id);
        }
      }, 1000);
    } catch (err) {
      console.error('Ride publishing error:', err);
      const isTimeout = err?.code === 'ECONNABORTED' || err?.message?.includes('timeout');
      const msg = isTimeout 
        ? 'The backend server is waking up. Please click "Publish Ride" again to complete.' 
        : (err?.response?.data?.error || 'Failed to save ride to database. Please check your connection and retry.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#FAF9FF] pt-24 pb-16 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Offer a Ride in 3 Easy Steps
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Share Your Journey &bull; Cover Fuel Costs
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Choose your vehicle type, set your route with highway stops, and connect with verified co-passengers.
          </p>
        </div>

        {/* ================= VEHICLE TYPE SELECTOR CARDS ================= */}
        <div className="mb-8">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5 text-center">
            Select Your Vehicle Type
          </label>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {Object.entries(VEHICLE_CONFIGS).map(([key, config]) => {
              const IconComponent = config.icon;
              const isSelected = vehicleType === key;
              return (
                <div
                  key={key}
                  onClick={() => handleVehicleTypeChange(key)}
                  className={`relative p-4 sm:p-5 rounded-3xl border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-between ${
                    isSelected
                      ? 'border-purple-600 bg-white shadow-xl shadow-purple-600/15 scale-[1.02]'
                      : 'border-slate-200 bg-white/70 hover:bg-white hover:border-purple-200'
                  }`}
                >
                  {/* Badge */}
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${
                    isSelected ? 'bg-purple-100 text-purple-900' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {config.badge}
                  </span>

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center my-1 transition-colors ${
                    isSelected ? 'bg-gradient-to-br from-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/30' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div className="mt-2">
                    <div className="text-sm sm:text-base font-black text-slate-900">{config.label}</div>
                    <div className="text-[11px] text-slate-400 font-medium hidden sm:block">{config.desc}</div>
                  </div>

                  {/* Active Radio Dot */}
                  <div className={`mt-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 3-STEP PROGRESS STEPPER ================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm mb-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            
            {/* Step 1 */}
            <div 
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${
                currentStep === 1 
                  ? 'bg-purple-50 border border-purple-300 text-purple-950 shadow-xs' 
                  : currentStep > 1 
                  ? 'bg-emerald-50/60 text-emerald-800' 
                  : 'text-slate-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep === 1 
                  ? 'bg-gradient-to-br from-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/25' 
                  : currentStep > 1 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-extrabold uppercase tracking-wider">Step 1</div>
                <div className="text-sm font-bold truncate">Route &amp; Map</div>
              </div>
            </div>

            {/* Step 2 */}
            <div 
              onClick={() => origin && destination && setCurrentStep(2)}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                currentStep === 2 
                  ? 'bg-purple-50 border border-purple-300 text-purple-950 shadow-xs cursor-pointer' 
                  : currentStep > 2 
                  ? 'bg-emerald-50/60 text-emerald-800 cursor-pointer' 
                  : 'text-slate-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep === 2 
                  ? 'bg-gradient-to-br from-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/25' 
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
                  ? 'bg-purple-50 border border-purple-300 text-purple-950 shadow-xs cursor-pointer' 
                  : 'text-slate-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep === 3 
                  ? 'bg-gradient-to-br from-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/25' 
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

        {/* Wizard Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-xl transition-all">

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
              <p className="text-emerald-700 text-sm">Your ride is live. Passengers can now book seats on your route!</p>
            </div>
          )}

          {/* ================= STEP 1: ROUTE, MAP & EN-ROUTE STOPS ================= */}
          {currentStep === 1 && (
            <div className="space-y-7 animate-fadeIn">
              
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Where are you driving with your {currentVehicleConfig.label}?</h2>
                <p className="text-sm text-slate-500 mt-1">Select your pickup and destination to see your live highway map and add en-route stop cities.</p>
              </div>

              {/* Origin & Destination Inputs */}
              <div className="relative grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
                
                {/* Origin (Pickup) */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    Pickup Location (Origin)
                  </label>
                  <CityAutocomplete
                    value={origin}
                    onChange={setOrigin}
                    placeholder="e.g. Chennai"
                    iconColor="text-purple-600"
                  />
                </div>

                {/* Swap Button */}
                <div className="flex justify-center md:pt-6">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="p-3 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 border border-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                    title="Swap pickup and destination"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Destination (Drop-off) */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    Drop-off Location (Destination)
                  </label>
                  <CityAutocomplete
                    value={destination}
                    onChange={setDestination}
                    placeholder="e.g. Bengaluru"
                    iconColor="text-indigo-600"
                  />
                </div>
              </div>

              {/* ================= INTERACTIVE ROUTE MAP (IMMEDIATELY AFTER PICKUP & DESTINATION) ================= */}
              {origin && destination && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                        Interactive Route Map Preview
                      </span>
                    </div>
                    <span className="text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 shadow-xs">
                      {calculatingRoute ? 'Calculating route...' : `${estimatedKm} km · ${durationText}`}
                    </span>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-purple-100 shadow-md">
                    <RouteMap
                      pickup={origin}
                      dropoff={destination}
                      stops={stops}
                      height={320}
                    />
                  </div>
                </div>
              )}

              {/* ================= EN-ROUTE HIGHWAY STOP CITY SUGGESTIONS ================= */}
              {origin && destination && (
                <div className="p-6 bg-gradient-to-br from-purple-50/70 via-white to-violet-50/50 border border-purple-200 rounded-3xl space-y-4 shadow-sm">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Suggested Stop Cities Along Your Highway
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Click any town or city along your highway to pick up passengers and cover more fuel cost!
                      </div>
                    </div>
                    {stops.length > 0 && (
                      <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs self-start sm:self-auto shadow-xs">
                        {stops.length} stop{stops.length > 1 ? 's' : ''} added
                      </span>
                    )}
                  </div>

                  {/* Clickable Suggested Stop Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {suggestedStopsForRoute.map((city) => {
                      const isAdded = stops.includes(city);
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => toggleStop(city)}
                          className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                            isAdded
                              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/25 scale-105'
                              : 'bg-white hover:bg-purple-50 hover:border-purple-300 border border-slate-200 text-slate-800 shadow-xs'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>{city}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 text-purple-600" />
                              <span>{city}</span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Stop Input */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={customStopInput}
                      onChange={(e) => setCustomStopInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomStop())}
                      placeholder="Add another stop city, toll gate, or junction..."
                      className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={addCustomStop}
                      className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer shadow-sm"
                    >
                      + Add Stop City
                    </button>
                  </div>

                  {/* Active Stops Chain Visualization */}
                  {stops.length > 0 && (
                    <div className="pt-3 border-t border-purple-100 flex items-center gap-2 flex-wrap text-xs font-bold text-slate-700">
                      <span className="text-slate-400">Route itinerary:</span>
                      <span className="text-purple-900 font-extrabold">{origin}</span>
                      {stops.map((stop, idx) => (
                        <React.Fragment key={idx}>
                          <span className="text-slate-400">&rarr;</span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-purple-200 text-purple-950 rounded-lg shadow-xs">
                            <MapPin className="w-3 h-3 text-purple-600" />
                            {stop}
                            <button
                              type="button"
                              onClick={() => removeStop(stop)}
                              className="text-slate-400 hover:text-rose-600 ml-1 text-sm font-bold cursor-pointer"
                              title="Remove stop"
                            >
                              &times;
                            </button>
                          </span>
                        </React.Fragment>
                      ))}
                      <span className="text-slate-400">&rarr;</span>
                      <span className="text-indigo-900 font-extrabold">{destination}</span>
                    </div>
                  )}

                </div>
              )}

              {/* Date & Time Row (Positioned right below Map & Stops) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Departure Date
                  </label>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0" />
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
                    <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <input
                      type="time"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-900 text-base focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 1 Footer Action */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  disabled={!origin.trim() || !destination.trim()}
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
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
                <h2 className="text-2xl font-bold text-slate-900">Seats &amp; Fair Pricing for your {currentVehicleConfig.label}</h2>
                <p className="text-sm text-slate-500 mt-1">Set available passenger capacity and price per seat.</p>
              </div>

              {/* Seats Selector */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base font-extrabold text-slate-900">Available Passenger Seats</div>
                    <div className="text-xs text-slate-500">
                      {vehicleType === 'bike' 
                        ? '1 Pillion seat available on your motorcycle' 
                        : `Maximum comfort capacity for your ${currentVehicleConfig.label}`}
                    </div>
                  </div>

                  {vehicleType !== 'bike' ? (
                    <div className="flex items-center gap-4 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
                      <button
                        type="button"
                        onClick={() => setSeatsAvailable(Math.max(1, seatsAvailable - 1))}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-extrabold text-lg text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-2xl font-black text-slate-900 w-8 text-center">
                        {seatsAvailable}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSeatsAvailable(Math.min(currentVehicleConfig.maxSeats, seatsAvailable + 1))}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-extrabold text-lg text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div className="px-4 py-2 bg-purple-100 text-purple-900 font-black rounded-xl text-sm">
                      1 Pillion Seat
                    </div>
                  )}
                </div>

                {/* Visual Seats Row */}
                {vehicleType !== 'bike' && (
                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                    {Array.from({ length: currentVehicleConfig.maxSeats }).map((_, i) => (
                      <div
                        key={i}
                        onClick={() => setSeatsAvailable(i + 1)}
                        className={`flex-1 min-w-[50px] py-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                          i < seatsAvailable
                            ? 'bg-purple-700 border-purple-700 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-400 hover:border-purple-200'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Selector */}
              <div className="p-6 bg-slate-50/70 border border-purple-100 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-extrabold text-slate-900">Price per Passenger Seat</div>
                    <div className="text-xs text-slate-500">
                      Recommended: <span className="font-bold text-purple-700">₹{Math.max(vehicleType === 'bike' ? 50 : 100, Math.round((estimatedKm * currentVehicleConfig.defaultPricePerKm) / 50) * 50)}</span> for {estimatedKm} km on {currentVehicleConfig.label}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPricePerSeat(Math.max(50, pricePerSeat - 50))}
                      className="px-3 py-2 bg-white border border-slate-200 hover:bg-purple-50 rounded-xl font-bold text-xs text-slate-700 transition-colors cursor-pointer"
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
                        className="w-32 pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setPricePerSeat(pricePerSeat + 50)}
                      className="px-3 py-2 bg-white border border-slate-200 hover:bg-purple-50 rounded-xl font-bold text-xs text-slate-700 transition-colors cursor-pointer"
                    >
                      + ₹50
                    </button>
                  </div>
                </div>

                {/* Earnings Projection Pill */}
                <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-purple-950 text-xs font-bold">
                    <span className="text-base">💰</span>
                    <span>Total fuel cost recovery with full {currentVehicleConfig.label}:</span>
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
                    ? 'border-purple-600 bg-purple-50/60 shadow-sm' 
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${instantBooking ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">Instant Booking Enabled</div>
                    <div className="text-xs text-slate-500">Co-travelers book immediately without waiting for your manual approval</div>
                  </div>
                </div>
                <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${instantBooking ? 'bg-purple-700' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${instantBooking ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Step 2 Footer Navigation */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
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
                <h2 className="text-2xl font-bold text-slate-900">Your {currentVehicleConfig.label} &amp; Trip Review</h2>
                <p className="text-sm text-slate-500 mt-1">Confirm details and publish to thousands of co-travelers.</p>
              </div>

              {/* Vehicle Info */}
              <div className="p-6 bg-slate-50/70 border border-purple-100 rounded-3xl space-y-4">
                <div className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <currentVehicleConfig.icon className="w-5 h-5 text-purple-700" />
                  {currentVehicleConfig.label} Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      {currentVehicleConfig.label} Model &amp; Make
                    </label>
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder={`e.g. ${currentVehicleConfig.defaultModel}`}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 tracking-wider"
                    />
                  </div>
                </div>

                {/* Vehicle Presets */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-xs font-bold text-slate-400">Suggestions:</span>
                  {currentVehicleConfig.presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setVehicleModel(preset)}
                      className="px-2.5 py-1 bg-white hover:bg-purple-50 border border-purple-100 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Amenities Toggles based on Vehicle */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  {currentVehicleConfig.amenities.map((amenity) => {
                    const isChecked = selectedAmenities[amenity.id];
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => setSelectedAmenities({
                          ...selectedAmenities,
                          [amenity.id]: !isChecked
                        })}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isChecked ? 'bg-purple-100 border-purple-400 text-purple-950 font-extrabold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-purple-200'
                        }`}
                      >
                        <span>{amenity.icon}</span>
                        <span>{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trip Summary Ticket */}
              <div className="border-2 border-dashed border-purple-300 rounded-3xl p-6 bg-gradient-to-br from-purple-50/40 via-white to-indigo-50/30 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-purple-900">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    Verified RB Trip &bull; {currentVehicleConfig.label}
                  </div>
                  <span className="px-3 py-1 bg-purple-700 text-white rounded-full text-xs font-black shadow-sm">
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
                    <span className="text-xs text-slate-400 font-bold uppercase">Vehicle &amp; Seats</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">{seatsAvailable} Seats ({currentVehicleConfig.label})</div>
                    <div className="text-xs text-slate-500">{vehicleModel}</div>
                  </div>
                </div>

                {stops.length > 0 && (
                  <div className="text-xs text-slate-600 pt-2 border-t border-purple-100 flex items-center gap-1.5">
                    <span className="font-bold text-purple-800">Via Stops:</span> {stops.join(' · ')}
                  </div>
                )}
              </div>

              {/* Final Publish Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="button"
                  disabled={loading || success}
                  onClick={handleFinalPublish}
                  className="px-10 py-4 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 disabled:opacity-50 text-white font-black text-base rounded-2xl shadow-xl shadow-purple-700/30 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publishing Ride...
                    </>
                  ) : (
                    <>
                      Publish {currentVehicleConfig.label} Ride 🚀
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
