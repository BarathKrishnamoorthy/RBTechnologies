import React, { useState, useEffect } from 'react';
import { searchRides } from '../api';
import { MapPin, Calendar, Clock, Star, ShieldCheck, Zap, Car, Filter, ArrowRight, CheckCircle2 } from 'lucide-react';
import CityAutocomplete from '../components/CityAutocomplete';

export default function SearchRides({ initialParams, onSelectRide }) {
  const [origin, setOrigin] = useState(initialParams?.origin || '');
  const [destination, setDestination] = useState(initialParams?.destination || '');
  const [date, setDate] = useState(initialParams?.date || '');
  const [seats, setSeats] = useState(initialParams?.seats || 1);

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [instantOnly, setInstantOnly] = useState(false);
  const [acOnly, setAcOnly] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc'); // price_asc, departure_asc

  const fetchRides = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchRides({ origin, destination, date, seats });
      setRides(data);
    } catch (err) {
      setError('Failed to fetch rides from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRides();
  };

  // Filter & Sort logic
  const filteredRides = rides
    .filter((ride) => (!instantOnly || ride.instant_booking) && (!acOnly || ride.vehicle?.has_ac))
    .sort((a, b) => {
      const priceA = a.calculated_fare ?? a.price;
      const priceB = b.calculated_fare ?? b.price;
      if (sortBy === 'price_asc')  return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      return a.departure_time.localeCompare(b.departure_time);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Search Header Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase">From</label>
            <div className="mt-1">
              <CityAutocomplete
                value={origin}
                onChange={setOrigin}
                placeholder="Departure City"
                icon={<></>} /* No map pin icon inside search bar to match original design */
                wrapperClass="px-3 py-1.5 rounded-lg"
                inputClass="text-sm font-semibold !text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase">To</label>
            <div className="mt-1">
              <CityAutocomplete
                value={destination}
                onChange={setDestination}
                placeholder="Destination City"
                icon={<></>}
                wrapperClass="px-3 py-1.5 rounded-lg"
                inputClass="text-sm font-semibold !text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Seats</label>
              <select
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full mt-1 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
              >
                <option value={1}>1 Seat</option>
                <option value={2}>2 Seats</option>
                <option value={3}>3 Seats</option>
                <option value={4}>4 Seats</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            Update Search
          </button>
        </form>
      </div>

      {/* Main Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 h-fit">
          <div className="flex items-center space-x-2 font-bold text-slate-900 pb-3 border-b border-slate-100">
            <Filter className="w-4 h-4 text-cyan-600" />
            <span>Filter Rides</span>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
              >
                <option value="price_asc">Lowest Price</option>
                <option value="price_desc">Highest Price</option>
                <option value="departure_asc">Earliest Departure</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={instantOnly}
                  onChange={(e) => setInstantOnly(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                />
                <span className="font-medium text-slate-700">Instant Booking Only</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acOnly}
                  onChange={(e) => setAcOnly(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                />
                <span className="font-medium text-slate-700">AC Car Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Ride Cards List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Available Rides <span className="text-slate-500 text-sm font-medium">({filteredRides.length} found)</span>
            </h2>
          </div>

          {loading && (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              Loading available carpool rides...
            </div>
          )}

          {error && (
            <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200 font-semibold">
              {error}
            </div>
          )}

          {!loading && filteredRides.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Car className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No rides found for this route</h3>
              <p className="text-sm text-slate-500">Try changing dates or searching popular routes like Mumbai to Pune.</p>
            </div>
          )}

          {!loading && filteredRides.map((ride) => (
            <div
              key={ride.id}
              onClick={() => onSelectRide(ride.id)}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-cyan-500 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-100 gap-4">
                
                {/* Route Timeline */}
                <div className="space-y-2">
                  {/* Date badge */}
                  {ride.departure_date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="text-xs font-bold text-slate-600">
                        {(() => {
                          try {
                            return new Intl.DateTimeFormat('en-IN', {
                              weekday: 'short', day: 'numeric',
                              month: 'short', year: 'numeric',
                            }).format(new Date(ride.departure_date));
                          } catch { return ride.departure_date; }
                        })()}
                      </span>
                    </div>
                  )}

                  {/* Time + cities row */}
                  <div className="flex items-center space-x-4">
                    <div className="text-left space-y-1">
                      <span className="text-lg font-bold text-slate-900">{ride.departure_time}</span>
                      <span className="block text-xs font-semibold text-slate-500">
                        {ride.boarding_city || ride.origin}
                      </span>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <span className="text-[10px] font-bold text-slate-400">{ride.duration}</span>
                      <div className="w-24 sm:w-32 h-0.5 bg-slate-300 relative my-1">
                        <div className="w-2 h-2 rounded-full bg-cyan-600 absolute left-0 -top-0.75" />
                        <div className="w-2 h-2 rounded-full bg-cyan-600 absolute right-0 -top-0.75" />
                      </div>
                      {/* Show if this is a partial segment */}
                      {ride.boarding_city && ride.boarding_city !== ride.origin && (
                        <span className="text-[9px] text-cyan-600 font-semibold">via {ride.origin}</span>
                      )}
                    </div>

                    <div className="text-left space-y-1">
                      <span className="text-lg font-bold text-slate-900">{ride.arrival_time}</span>
                      <span className="block text-xs font-semibold text-slate-500">
                        {ride.alighting_city || ride.destination}
                      </span>
                    </div>
                  </div>
                </div>


                {/* Price & Book Button */}
                <div className="text-right flex sm:flex-col justify-between items-center sm:items-end">
                  <div className="text-2xl font-black text-slate-900">
                    ₹{ride.calculated_fare ?? ride.price}
                    <span className="text-xs font-normal text-slate-500"> / seat</span>
                  </div>
                  {/* Show if fare is a partial-segment price */}
                  {ride.calculated_fare && ride.calculated_fare !== ride.price && (
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Full route ₹{ride.price}
                    </span>
                  )}
                  <span className="text-xs font-bold text-cyan-600 group-hover:underline inline-flex items-center mt-1">
                    View & Book <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>

              </div>

              {/* Driver & Vehicle Footer */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <div className="flex items-center space-x-3">
                  <img
                    src={ride.driver.avatar}
                    alt={ride.driver.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center space-x-1 font-bold text-slate-900">
                      <span>{ride.driver.name}</span>
                      {ride.driver.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-amber-500 font-semibold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{ride.driver.rating}</span>
                      <span className="text-slate-400">({ride.driver.reviews_count} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {ride.instant_booking && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-md border border-emerald-200">
                      <Zap className="w-3 h-3 mr-1" /> Instant
                    </span>
                  )}
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg">
                    {ride.seats_available} seats left
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
