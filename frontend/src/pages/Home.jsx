import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users, Search, ArrowRight, ShieldCheck, Leaf, Car, ArrowLeftRight, CheckCircle2, Zap, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomDropdown = ({ icon: Icon, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || '';

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center">
           {Icon && <Icon className="w-4 h-4 text-brand-lightblue mr-2 md:hidden" />}
           <span className="text-sm md:text-base text-brand-dark font-bold">{selectedLabel}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-brand-dark/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-3 left-0 w-full min-w-[150px] max-h-64 overflow-y-auto bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50 hide-scrollbar">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm font-bold cursor-pointer hover:bg-brand-offwhite transition-colors ${value === opt.value ? 'text-brand-deepblue bg-brand-offwhite/50' : 'text-brand-dark'}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Home({ onSearch }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('find');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [seats, setSeats] = useState(1);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'find') {
      onSearch({ origin, destination, date, vehicleType, seats });
    } else {
      navigate('/publish');
    }
  };

  const getSeatOptions = () => {
    let max = 7;
    if (vehicleType === 'bike') max = 1;
    else if (vehicleType === 'car') max = 7;
    else if (vehicleType === 'van') max = 50;
    
    return Array.from({ length: max }, (_, i) => i + 1);
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const popularRoutes = [
    { from: 'Chennai', to: 'Bengaluru', price: '₹300', rides: '120+', image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&q=80&w=600' },
    { from: 'Delhi', to: 'Jaipur', price: '₹400', rides: '95+', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=600' },
    { from: 'Mumbai', to: 'Pune', price: '₹350', rides: '180+', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=600' },
    { from: 'Bengaluru', to: 'Hyderabad', price: '₹500', rides: '110+', image: 'https://images.unsplash.com/photo-1600100397608-f010f419c9b3?auto=format&fit=crop&q=80&w=600' },
  ];

  const featuredRides = [
    { name: 'Arjun K.', rating: '4.8', reviews: 32, from: 'Chennai', to: 'Bengaluru', date: '12 Oct 2026 - 08:00 AM', seats: 3, price: '₹400', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Priya S.', rating: '4.9', reviews: 28, from: 'Delhi', to: 'Jaipur', date: '12 Oct 2026 - 09:00 AM', seats: 2, price: '₹450', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Rahul M.', rating: '4.7', reviews: 41, from: 'Mumbai', to: 'Pune', date: '12 Oct 2026 - 07:30 AM', seats: 1, price: '₹350', avatar: 'https://randomuser.me/api/portraits/men/85.jpg' },
    { name: 'Sneha R.', rating: '4.9', reviews: 36, from: 'Bengaluru', to: 'Hyderabad', date: '12 Oct 2026 - 10:00 AM', seats: 3, price: '₹500', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  ];

  return (
    <div className="bg-brand-offwhite min-h-screen">
      {/* Hero Wrapper for Overlap */}
      <div className="relative">
        {/* Hero Section */}
        <section className="relative w-full h-auto md:h-[600px] flex flex-col justify-center pt-28 pb-24 md:pt-20 md:pb-24">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000" 
              alt="Friends carpooling" 
              className="w-full h-full object-cover rounded-b-[30px] md:rounded-b-[40px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white/95 via-white/80 to-white/10 md:to-transparent rounded-b-[30px] md:rounded-b-[40px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-dark leading-[1.15] mb-4 md:mb-6">
              Smarter travel, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-deepblue to-brand-lightblue">better together.</span>
            </h1>
            <p className="text-base md:text-lg text-brand-dark/80 mb-6 md:mb-8 max-w-lg font-medium">
              Join thousands of trusted commuters. Share your journey, split the costs, and travel across India with comfort, safety and confidence.
            </p>
            
            {/* Badges - Scrollable on mobile, grid on desktop */}
            <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-3 md:gap-4 snap-x hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0">
              <div className="flex-shrink-0 w-[140px] md:w-auto snap-start flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white/50">
                <Car className="w-5 h-5 text-brand-deepblue" />
                <span className="text-[11px] md:text-xs font-bold text-brand-dark leading-tight">Affordable<br/>Travel</span>
              </div>
              <div className="flex-shrink-0 w-[140px] md:w-auto snap-start flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white/50">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span className="text-[11px] md:text-xs font-bold text-brand-dark leading-tight">Verified<br/>Users</span>
              </div>
              <div className="flex-shrink-0 w-[140px] md:w-auto snap-start flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white/50">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-[11px] md:text-xs font-bold text-brand-dark leading-tight">Safe & Secure<br/>Journeys</span>
              </div>
              <div className="flex-shrink-0 w-[140px] md:w-auto snap-start flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white/50">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="text-[11px] md:text-xs font-bold text-brand-dark leading-tight">Cleaner<br/>Environment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Widget - Natural flow with negative margin on mobile, absolute positioned at the very bottom on desktop */}
      <div className="relative z-20 w-full px-4 -mt-16 md:absolute md:bottom-0 md:translate-y-1/2 md:mt-0">
        <div className="w-full max-w-[1200px] mx-auto">
            {/* Tabs */}
            <div className="flex space-x-2 mb-0 ml-2 md:ml-4">
              <button 
                onClick={() => setActiveTab('find')}
                className={`flex items-center space-x-2 px-5 md:px-6 py-2.5 md:py-3 rounded-t-xl md:rounded-t-2xl font-bold text-sm transition-colors ${activeTab === 'find' ? 'bg-white text-brand-deepblue shadow-[0_-4px_10px_rgba(0,0,0,0.02)]' : 'bg-white/70 backdrop-blur text-brand-dark/60 hover:bg-white'}`}
              >
                <Car className="w-4 h-4" />
                <span>Find a ride</span>
              </button>
              <button 
                onClick={() => setActiveTab('offer')}
                className={`flex items-center space-x-2 px-5 md:px-6 py-2.5 md:py-3 rounded-t-xl md:rounded-t-2xl font-bold text-sm transition-colors ${activeTab === 'offer' ? 'bg-white text-brand-deepblue shadow-[0_-4px_10px_rgba(0,0,0,0.02)]' : 'bg-white/70 backdrop-blur text-brand-dark/60 hover:bg-white'}`}
              >
                <Car className="w-4 h-4" />
                <span>Offer a ride</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl md:rounded-3xl rounded-tl-none shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col md:flex-row items-stretch md:items-center p-2 md:p-3 border border-gray-100">
              
              {/* Origin & Destination with Swap */}
              <div className="flex-1 w-full flex flex-col md:flex-row relative group md:border-r border-gray-200">
                <div className="flex-1 px-4 md:pl-6 md:pr-10 py-3 border-b md:border-b-0 border-gray-100 hover:bg-brand-offwhite/30 rounded-t-xl md:rounded-none transition-colors cursor-text">
                  <label className="block text-[10px] md:text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1">Leaving from</label>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-brand-lightblue mr-2" />
                    <input type="text" placeholder="City or place" value={origin} onChange={e => setOrigin(e.target.value)} className="w-full text-sm md:text-base text-brand-dark font-bold focus:outline-none placeholder-brand-dark/30 bg-transparent" />
                  </div>
                </div>
                
                <button type="button" onClick={handleSwap} className="absolute top-1/2 left-[90%] md:left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-brand-deepblue hover:bg-brand-deepblue hover:text-white hover:border-brand-deepblue shadow-md z-10 transition-all duration-300">
                  <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5 md:rotate-0 rotate-90" />
                </button>

                <div className="flex-1 px-4 md:pl-10 md:pr-6 py-3 hover:bg-brand-offwhite/30 rounded-b-xl md:rounded-none transition-colors cursor-text">
                  <label className="block text-[10px] md:text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1">Going to</label>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-brand-deepblue mr-2" />
                    <input type="text" placeholder="City or place" value={destination} onChange={e => setDestination(e.target.value)} className="w-full text-sm md:text-base text-brand-dark font-bold focus:outline-none placeholder-brand-dark/30 bg-transparent" />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="w-full md:w-auto flex-1 px-4 md:px-6 py-3 md:border-r border-gray-200 border-t md:border-t-0 hover:bg-brand-offwhite/30 transition-colors cursor-text">
                <label className="block text-[10px] md:text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1">Travel date</label>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-brand-lightblue mr-2 md:hidden" />
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full text-sm md:text-base text-brand-dark font-bold focus:outline-none bg-transparent" />
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="w-full md:w-auto flex-1 px-4 md:px-6 py-3 md:border-r border-gray-200 border-t md:border-t-0 hover:bg-brand-offwhite/30 transition-colors">
                <label className="block text-[10px] md:text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1">Vehicle</label>
                <CustomDropdown 
                  icon={Car}
                  value={vehicleType}
                  onChange={(v) => {
                    setVehicleType(v);
                    setSeats(1);
                  }}
                  options={[
                    { value: 'bike', label: 'Bike' },
                    { value: 'car', label: 'Car' },
                    { value: 'van', label: 'Van' }
                  ]}
                />
              </div>

              {/* Passengers */}
              <div className="w-full md:w-auto flex-1 px-4 md:px-6 py-3 border-t border-gray-200 md:border-none hover:bg-brand-offwhite/30 transition-colors rounded-b-xl md:rounded-none">
                <label className="block text-[10px] md:text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1">Passengers</label>
                <CustomDropdown 
                  icon={Users}
                  value={seats}
                  onChange={setSeats}
                  options={getSeatOptions().map(n => ({ value: n, label: `${n} passenger${n>1?'s':''}` }))}
                />
              </div>

              {/* Button */}
              <button type="submit" className="w-full md:w-auto mt-3 md:mt-0 px-8 py-3.5 md:py-5 bg-brand-deepblue hover:bg-brand-dark text-white font-bold text-sm md:text-base rounded-xl md:rounded-2xl transition-all shadow-[0_4px_14px_rgba(58,77,161,0.39)] hover:shadow-[0_6px_20px_rgba(28,32,37,0.23)] flex items-center justify-center space-x-2 hover:-translate-y-0.5">
                <Search className="w-5 h-5" />
                <span>{activeTab === 'find' ? 'Search Rides' : 'Offer a Ride'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Spacer for floating widget - only visible on desktop */}
      <div className="hidden md:block h-24"></div>

      {/* Vehicles Section */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-brand-dark mb-4">Every Vehicle for Every Journey</h2>
          <p className="text-brand-dark/70 max-w-2xl mx-auto">At RB Rides, we offer a versatile fleet to match your travel needs. Whether you are navigating city traffic, planning a weekend getaway, or moving with a group, we have the perfect ride for you.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Car */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center group">
            <div className="w-20 h-20 mx-auto bg-brand-deepblue/10 text-brand-deepblue rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Car className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-3">Car rides</h3>
            <p className="text-brand-dark/60 text-sm">Comfortable city-to-city rides. Perfect for individuals or small groups wanting a relaxed, climate-controlled journey.</p>
          </div>

          {/* Bike */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center group">
            <div className="w-20 h-20 mx-auto bg-brand-lightblue/10 text-brand-deepblue rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {/* Using Zap as a stand-in for a bike/speed icon since lucide might not have a generic bike easily imported here without changing imports */}
              <Zap className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-3">Bike rides</h3>
            <p className="text-brand-dark/60 text-sm">Beat the traffic and arrive faster. Ideal for quick, affordable solo commutes across the busy city streets.</p>
          </div>

          {/* Van */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center group">
            <div className="w-20 h-20 mx-auto bg-brand-deepblue/10 text-brand-deepblue rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-3">Van rides</h3>
            <p className="text-brand-dark/60 text-sm">Traveling with a crew? Our van options are spacious, reliable, and perfect for family trips or group outings.</p>
          </div>
        </div>
      </section>

      {/* Why Choose RB Rides */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-extrabold text-brand-dark mb-8">Why choose RB Rides?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-brand-dark">Save Money</h3>
              <p className="text-xs text-brand-dark/60 mt-1">Split travel costs</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-brand-deepblue">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-brand-dark">Meet People</h3>
              <p className="text-xs text-brand-dark/60 mt-1">Travel with like-minded communities</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-brand-dark">Verified Users</h3>
              <p className="text-xs text-brand-dark/60 mt-1">Profile & document verification</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-brand-deepblue">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-brand-dark">Greener Travel</h3>
              <p className="text-xs text-brand-dark/60 mt-1">Fewer cars, cleaner India</p>
            </div>
          </div>

        </div>
      </section>

      {/* About Us */}
      <section className="bg-white py-24">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-extrabold text-brand-dark mb-6">About RB Rides</h2>
              <p className="text-lg text-brand-dark/70 mb-6 leading-relaxed">
                We are on a mission to revolutionize how India commutes. At RB Rides, we believe that sharing journeys doesn't just save money—it brings communities together and takes a massive step toward environmental sustainability.
              </p>
              <p className="text-lg text-brand-dark/70 mb-8 leading-relaxed">
                Born out of a simple idea to utilize empty seats on our daily routes, RB Rides has grown into a trusted marketplace that connects thousands of verified drivers and passengers every single day. Whether you need the speed of a bike, the comfort of a car, or the space of a van, our platform makes finding your perfect ride seamless and secure.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                <div>
                  <div className="text-3xl font-extrabold text-brand-deepblue mb-1">100%</div>
                  <div className="text-sm font-bold text-brand-dark/60">Verified Users</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-brand-deepblue mb-1">24/7</div>
                  <div className="text-sm font-bold text-brand-dark/60">Support</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-brand-deepblue mb-1">Zero</div>
                  <div className="text-sm font-bold text-brand-dark/60">Hidden Fees</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full relative">
              <div className="absolute inset-0 bg-brand-lightblue/20 rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                alt="RB Rides Team" 
                className="rounded-3xl shadow-xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-white py-20 border-t border-brand-offwhite">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-brand-dark">How Carpooling Works</h2>
            <p className="text-brand-dark/60 mt-4 max-w-2xl mx-auto">Whether you're hitting the road or looking for a ride, sharing the journey is simple, safe, and cost-effective.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* For Passengers */}
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-brand-lightblue/10 text-brand-deepblue font-bold text-sm mb-6">For Passengers</div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-deepblue text-white font-bold flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-lg text-brand-dark mb-1">Search for a ride</h4>
                    <p className="text-brand-dark/70 text-sm">Enter your departure and arrival points, plus your travel date. We'll show you drivers heading your way.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-deepblue text-white font-bold flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-lg text-brand-dark mb-1">Book and pay online</h4>
                    <p className="text-brand-dark/70 text-sm">Review driver profiles, ratings, and vehicle details. Book your seat securely through our platform.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-deepblue text-white font-bold flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-lg text-brand-dark mb-1">Travel together</h4>
                    <p className="text-brand-dark/70 text-sm">Meet your driver at the agreed pickup point, enjoy the conversation, and arrive at your destination.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Drivers */}
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-brand-deepblue/10 text-brand-deepblue font-bold text-sm mb-6">For Drivers</div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-brand-deepblue text-brand-deepblue font-bold flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-lg text-brand-dark mb-1">Publish your ride</h4>
                    <p className="text-brand-dark/70 text-sm">Indicate your route, date, time, and how many empty seats you have available.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-brand-deepblue text-brand-deepblue font-bold flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-lg text-brand-dark mb-1">Approve passengers</h4>
                    <p className="text-brand-dark/70 text-sm">Review requests from verified passengers. You have full control over who joins your journey.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-brand-deepblue text-brand-deepblue font-bold flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-lg text-brand-dark mb-1">Share costs</h4>
                    <p className="text-brand-dark/70 text-sm">Get paid reliably after the trip. Save significantly on fuel and toll expenses.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-brand-deepblue text-white py-20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-extrabold mb-6 leading-tight">The smarter way to commute across India</h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                By choosing to carpool, you are actively contributing to a cleaner, less congested India. Every shared ride means fewer cars on the road, lower carbon emissions, and less traffic in our beautiful cities.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-extrabold text-brand-lightblue mb-2">2.5M+</div>
                  <div className="text-sm text-white/70 font-semibold">Tons of CO2 saved</div>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-brand-lightblue mb-2">15M+</div>
                  <div className="text-sm text-white/70 font-semibold">Shared journeys</div>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-brand-lightblue mb-2">85%</div>
                  <div className="text-sm text-white/70 font-semibold">Fuel cost reduction</div>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-brand-lightblue mb-2">50+</div>
                  <div className="text-sm text-white/70 font-semibold">Cities connected</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full mt-10 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200" 
                alt="Friends enjoying a carpool ride" 
                className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C2025] text-white pt-16 pb-8">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded bg-brand-deepblue flex items-center justify-center text-white">
                  <span className="font-bold text-sm">RB</span>
                </div>
                <span className="text-xl font-bold">Rides</span>
              </div>
              <p className="text-gray-400 text-sm">Travel Together. A Better India.</p>
              <div className="flex space-x-4 mt-6">
                {/* Social icons placeholders */}
                <div className="w-8 h-8 rounded-full bg-blue-600"></div>
                <div className="w-8 h-8 rounded-full bg-pink-600"></div>
                <div className="w-8 h-8 rounded-full bg-red-600"></div>
                <div className="w-8 h-8 rounded-full bg-blue-400"></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Find a ride</a></li>
                <li><a href="#" className="hover:text-white">Offer a ride</a></li>
                <li><a href="#" className="hover:text-white">How it works</a></li>
                <li><a href="#" className="hover:text-white">Safety</a></li>
                <li><a href="#" className="hover:text-white">Help</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Terms of service</a></li>
                <li><a href="#" className="hover:text-white">Privacy policy</a></li>
                <li><a href="#" className="hover:text-white">Community guidelines</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Get the app</h4>
              <div className="space-y-3">
                <div className="bg-black border border-gray-700 rounded-lg p-2 flex items-center cursor-pointer hover:bg-gray-900 transition-colors">
                  <div className="w-6 h-6 mr-3 bg-white/20 rounded"></div>
                  <div>
                    <div className="text-[10px] text-gray-400 leading-none mb-1">GET IT ON</div>
                    <div className="text-xs font-bold leading-none">Google Play</div>
                  </div>
                </div>
                <div className="bg-black border border-gray-700 rounded-lg p-2 flex items-center cursor-pointer hover:bg-gray-900 transition-colors">
                  <div className="w-6 h-6 mr-3 bg-white/20 rounded"></div>
                  <div>
                    <div className="text-[10px] text-gray-400 leading-none mb-1">Download on the</div>
                    <div className="text-xs font-bold leading-none">App Store</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p>&copy; 2026 RB Rides. All rights reserved.</p>
            <p className="flex items-center mt-4 md:mt-0">
              <Leaf className="w-4 h-4 text-green-500 mr-2" />
              Made for a cleaner, connected India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
