import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { verifyDriverDocs, publishRideAdvanced } from '../api';
import { MapPin, Calendar, Clock, DollarSign, Car, ShieldCheck, CheckCircle2, Navigation, Plus, Trash2, FileCheck, Loader2, IndianRupee } from 'lucide-react';
import RouteMap from '../components/RouteMap';
import CityAutocomplete from '../components/CityAutocomplete';
// Generates dynamic route options from pickup → dropoff
function buildRouteOptions(from, to, baseDist) {
  if (!from || !to) return [];
  const dist1 = baseDist !== null && baseDist !== undefined ? baseDist : Math.floor(Math.random() * 100 + 280);
  const dist2 = dist1 + Math.floor(Math.random() * 30 + 15);
  return [
    { title: `Express Route (${dist1} km · ${from} → ${to})`, time: `${Math.floor(dist1/60)}h ${dist1%60}m`, badge: 'Fastest',   distance: dist1 },
    { title: `Highway Route (${dist2} km · via NH Bypass)`,    time: `${Math.floor(dist2/58)}h ${dist2%58}m`, badge: 'Less Tolls', distance: dist2 },
  ];
}

// Default stops: just origin + destination with placeholder km
function buildDefaultStops(from, to, baseDist) {
  const totalKm = baseDist !== null && baseDist !== undefined ? baseDist : Math.floor(Math.random() * 100 + 280);
  return [
    { city: from, distance_km: 0 },
    { city: to,   distance_km: totalKm },
  ];
}

/** Nominatim geocode → [lat, lon] — biased to India */
async function geocodeCity(city) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1&countrycodes=in`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const d = await r.json();
    if (!d.length) return null;
    return [parseFloat(d[0].lat), parseFloat(d[0].lon)];
  } catch { return null; }
}

/** OSRM road distance in km between two [lat,lon] points */
async function fetchKmBetween(from, to) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=false`;
    const r = await fetch(url);
    const d = await r.json();
    if (d.code !== 'Ok') return null;
    return Math.round(d.routes[0].distance / 1000); // metres → km
  } catch { return null; }
}

/**
 * Splits totalPrice proportionally across segments by km.
 * e.g. Chennai(0)→Mahabalipuram(40)→Pondicherry(160), total ₹400
 *   Chennai→Mahabalipuram = (40/160)*400 = ₹100
 *   Mahabalipuram→Pondicherry = (120/160)*400 = ₹300
 */
function rebuildPricesFromStops(stops, totalPrice) {
  const prices = {};
  const totalKm = Math.max(1, stops[stops.length - 1]?.distance_km || 1);
  for (let i = 0; i < stops.length - 1; i++) {
    for (let j = i + 1; j < stops.length; j++) {
      const segKm  = Math.max(1, stops[j].distance_km - stops[i].distance_km);
      const key    = `${stops[i].city} → ${stops[j].city}`;
      prices[key]  = Math.max(10, Math.round((segKm / totalKm) * totalPrice));
    }
  }
  return prices;
}

export default function PublishRideWizard({ onPublishSuccess, user }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const [cityStops, setCityStops] = useState([]);
  const [newCity,   setNewCity]   = useState('');
  const [addingStop, setAddingStop] = useState(false); // loading while OSRM fetches km
  const [suggestedStops, setSuggestedStops] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Total route price — driver sets this, segments auto-split by km proportion
  const [totalPrice, setTotalPrice] = useState(400); // ₹400 default

  // Segment Prices — auto-rebuilt whenever stops or totalPrice changes
  const [segmentPrices, setSegmentPrices] = useState({});

  const [baseRouteDistance, setBaseRouteDistance] = useState(null);

  // Dynamic route options derived from pickup/dropoff
  const routeOptions = useMemo(() => buildRouteOptions(pickup, dropoff, baseRouteDistance), [pickup, dropoff, baseRouteDistance]);

  // Called when the user advances from Step 2 \u2192 Step 3
  const handleEnterRouteStep = async () => {
    setAddingStop(true); // use as loading state
    let realDist = null;
    try {
      const pCoord = await geocodeCity(pickup);
      const dCoord = await geocodeCity(dropoff);
      if (pCoord && dCoord) {
        realDist = await fetchKmBetween(pCoord, dCoord);
      }
    } catch(e) {}
    
    setBaseRouteDistance(realDist);
    
    const routes = buildRouteOptions(pickup, dropoff, realDist);
    setSelectedRoute(routes[0]?.title || '');
    setSelectedRouteIndex(0);
    
    const stops = buildDefaultStops(pickup, dropoff, realDist);
    setCityStops(stops);
    setSegmentPrices(rebuildPricesFromStops(stops, totalPrice));
    
    setAddingStop(false);
    setCurrentStep(3);
  };

  // Fetch suggested stops when entering Step 4
  useEffect(() => {
    if (currentStep !== 4 || !pickup || !dropoff) return;
    
    let isCancelled = false;
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const originCoord = await geocodeCity(pickup);
        const destCoord = await geocodeCity(dropoff);
        if (!originCoord || !destCoord || isCancelled) return;
        
        const url = `https://router.project-osrm.org/route/v1/driving/${originCoord[1]},${originCoord[0]};${destCoord[1]},${destCoord[0]}?overview=full&geometries=geojson`;
        const r = await fetch(url);
        const d = await r.json();
        if (d.code !== 'Ok' || !d.routes?.length || isCancelled) return;
        
        const coords = d.routes[0].geometry.coordinates; // [lon, lat][]
        const len = coords.length;
        if (len < 10) return;
        
        // Pick 3 points at 25%, 50%, 75% along the route
        const indices = [Math.floor(len * 0.25), Math.floor(len * 0.5), Math.floor(len * 0.75)];
        const newSuggestions = [];
        
        for (let i of indices) {
          if (isCancelled) break;
          const pt = coords[i]; // pt is [lon, lat]
          const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pt[1]}&lon=${pt[0]}&zoom=10&addressdetails=1`;
          try {
            const nr = await fetch(nomUrl, { headers: { 'Accept-Language': 'en' } });
            const nd = await nr.json();
            if (nd && nd.address) {
              const town = nd.address.city || nd.address.town || nd.address.village || nd.address.county;
              // Clean out the word 'District' if present for cleaner chips
              const cleanTown = town ? town.replace(/ District/i, '') : null;
              if (cleanTown && cleanTown !== pickup && cleanTown !== dropoff && !newSuggestions.includes(cleanTown)) {
                newSuggestions.push(cleanTown);
              }
            }
          } catch(e) {}
          // Small delay between calls to respect Nominatim rate limit (1 req/sec)
          await new Promise(res => setTimeout(res, 600));
        }
        if (!isCancelled) setSuggestedStops(newSuggestions);
      } finally {
        if (!isCancelled) setLoadingSuggestions(false);
      }
    };
    
    // Only fetch if we haven't already for this exact route segment
    if (suggestedStops.length === 0) {
      fetchSuggestions();
    }
    
    return () => { isCancelled = true; };
  }, [currentStep, pickup, dropoff, suggestedStops.length]);

  // Rebuild prices when driver changes the total price
  const handleTotalPriceChange = (val) => {
    const p = Math.max(10, Number(val));
    setTotalPrice(p);
    setSegmentPrices(rebuildPricesFromStops(cityStops, p));
  };

  // Add a stop: geocode it, get real km from OSRM, insert sorted by km
  const handleAddStop = useCallback(async (overrideCity) => {
    const city = (typeof overrideCity === 'string' ? overrideCity : newCity).trim();
    if (!city || addingStop) return;
    setAddingStop(true);
    try {
      const originCoord = await geocodeCity(pickup);
      const stopCoord   = await geocodeCity(city);
      let kmFromOrigin  = Math.round(cityStops[cityStops.length - 1].distance_km / 2); // fallback midpoint

      if (originCoord && stopCoord) {
        const real = await fetchKmBetween(originCoord, stopCoord);
        if (real !== null) kmFromOrigin = real;
      }

      const dest     = cityStops[cityStops.length - 1];
      const midStops = cityStops.slice(1, -1);
      const newStop  = { city, distance_km: kmFromOrigin };
      const sorted   = [...midStops, newStop].sort((a, b) => a.distance_km - b.distance_km);
      const updated  = [cityStops[0], ...sorted, dest];

      setCityStops(updated);
      setSegmentPrices(rebuildPricesFromStops(updated, totalPrice));
      setNewCity('');
    } finally {
      setAddingStop(false);
    }
  }, [newCity, addingStop, cityStops, pickup, totalPrice]);

  const handleRemoveStop = (index) => {
    const updated = cityStops.filter((_, i) => i !== index);
    setCityStops(updated);
    setSegmentPrices(rebuildPricesFromStops(updated, totalPrice));
  };

  const [seatsAvailable, setSeatsAvailable] = useState(4);
  const [departureDate, setDepartureDate] = useState('2026-08-30');
  const [departureTime, setDepartureTime] = useState('06:30');
  
  // Driver Doc Verification
  const [licenseNumber, setLicenseNumber] = useState('DL-0420210088');
  const [rcNumber, setRcNumber] = useState('TN-07-RB-9988');
  const [docVerified, setDocVerified] = useState(false);
  const [docLoading, setDocLoading] = useState(false);

  const [publishLoading, setPublishLoading] = useState(false);


  const handleVerifyDocs = async () => {
    setDocLoading(true);
    try {
      await verifyDriverDocs({ license_number: licenseNumber, rc_number: rcNumber });
      setDocVerified(true);
    } catch (e) {
      alert('Verification failed');
    } finally {
      setDocLoading(false);
    }
  };

  const handleConfirmPublish = async () => {
    setPublishLoading(true);
    try {
      const created = await publishRideAdvanced({
        origin: pickup,
        destination: dropoff,
        origin_address: `${pickup} Central Station`,
        destination_address: `${dropoff} Silk Board`,
        departure_date: departureDate,
        departure_time: departureTime,
        arrival_time: '12:30',
        duration: '6h 00m',
        price: segmentPrices[`${pickup}-${dropoff}`] || 600,
        seats_available: seatsAvailable,
        city_stops: cityStops,
        segment_prices: segmentPrices,
        driver_name: user?.name || 'Unknown Driver',
        driver_phone: user?.phone || '+91 9876543210',
        vehicle_model: 'Innova Crysta (White)',
        plate_number: rcNumber
      });
      onPublishSuccess(created.id);
    } catch (e) {
      alert('Failed to publish ride.');
    } finally {
      setPublishLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl space-y-8">
        
        {/* Wizard Steps Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Step {currentStep} of 8</span>
            <span>{Math.round((currentStep / 8) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: PICKUP */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Step 1: Select Pickup Location</h2>
            <div className="pt-2 pb-6">
              <CityAutocomplete
                value={pickup}
                onChange={setPickup}
                placeholder="Enter pickup city (e.g. Chennai)"
              />
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!pickup.trim()}
              className="w-full py-3.5 bg-cyan-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl"
            >
              Next: Select Drop-off Location &rarr;
            </button>
          </div>
        )}

        {/* STEP 2: DROP-OFF + DATE + TIME */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Step 2: Where to &amp; When?</h2>
              <p className="text-xs text-slate-500 mt-1">Set your destination and departure schedule.</p>
            </div>

            {/* Drop-off */}
            <div className="z-20">
              <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Drop-off City</label>
              <CityAutocomplete
                value={dropoff}
                onChange={setDropoff}
                placeholder="Enter destination city (e.g. Bangalore)"
                iconColor="text-blue-500"
              />
            </div>

            {/* Date + Time row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Departure Date</label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <input
                    type="date"
                    value={departureDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full bg-transparent text-base font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Departure Time</label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                  <Clock className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full bg-transparent text-base font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Live summary preview */}
            {dropoff && departureDate && departureTime && (
              <div className="flex items-center gap-3 p-3 bg-cyan-50 border border-cyan-100 rounded-2xl text-xs font-semibold text-cyan-800">
                <span className="text-base">🚗</span>
                <span>
                  <span className="font-bold">{pickup}</span> &rarr; <span className="font-bold">{dropoff}</span>
                  {' · '}
                  {(() => { try { return new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(departureDate)); } catch { return departureDate; } })()}
                  {' at '}{departureTime}
                </span>
              </div>
            )}

            <div className="flex space-x-4">
              <button onClick={() => setCurrentStep(1)} className="w-1/3 py-3.5 bg-slate-100 font-bold rounded-xl">&larr; Back</button>
              <button
                onClick={handleEnterRouteStep}
                disabled={!dropoff.trim() || !departureDate || !departureTime || addingStop}
                className="w-2/3 py-3.5 bg-cyan-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl"
              >
                {addingStop ? 'Loading Route...' : 'Next: Select Route \u2192'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ROUTE SELECTION & MAP — side-by-side layout */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Step 3: Select Preferred Route Options</h2>

            {/* Two-column: routes left, map right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* LEFT — Dynamic Route Cards */}
              <div className="space-y-3">
                {routeOptions.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedRoute(r.title);
                      setSelectedRouteIndex(i);
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedRouteIndex === i
                        ? 'border-cyan-600 bg-cyan-50/60 shadow-md shadow-cyan-100'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 mr-2 ${
                        selectedRouteIndex === i ? 'border-cyan-600 bg-cyan-600' : 'border-slate-300'
                      }`} />
                      <div className="flex-1 space-y-0.5">
                        <div className="font-bold text-slate-900 text-sm leading-snug">{r.title}</div>
                        <span className="text-xs text-slate-500">{r.time} estimated travel time</span>
                      </div>
                      <span className={`ml-2 px-2.5 py-1 text-xs font-bold rounded-full flex-shrink-0 ${
                        i === 0 ? 'bg-cyan-100 text-cyan-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>{r.badge}</span>
                    </div>
                    <div className="ml-6 text-xs text-slate-400 flex items-center space-x-1">
                      <span className="font-semibold text-slate-600">{pickup}</span>
                      <span>→</span>
                      <span className="font-semibold text-slate-600">{dropoff}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT — Real Leaflet Map */}
              <div style={{ height: 400 }}>
                <RouteMap
                  pickup={pickup}
                  dropoff={dropoff}
                  routeIndex={selectedRouteIndex}
                  selectedRoute={selectedRoute}
                  height={400}
                />
              </div>

            </div>{/* end grid */}

            <div className="flex space-x-4">
              <button onClick={() => setCurrentStep(2)} className="w-1/3 py-3.5 bg-slate-100 font-bold rounded-xl">&larr; Back</button>
              <button onClick={() => setCurrentStep(4)} className="w-2/3 py-3.5 bg-cyan-600 text-white font-bold rounded-xl">Next: Add City Stops &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 4: ADD CITY STOPS + AUTO PRICE SPLIT */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Step 4: Add Route Stops & Fares</h2>
              <p className="text-xs text-slate-500 mt-1">
                Add intermediate cities. Fares auto-split by km using your rate below.
              </p>
            </div>

            {/* Total Price control — single input, segments auto-split */}
            <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center flex-shrink-0">
                  <IndianRupee className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900 mb-0.5">
                    Set Total Route Price
                  </div>
                  <div className="text-xs text-slate-500 mb-3">
                    Enter the full fare from <span className="font-semibold text-slate-700">{pickup}</span> to <span className="font-semibold text-slate-700">{dropoff}</span>.
                    Intermediate stops will be <span className="font-semibold text-cyan-700">auto-split by distance</span>.
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border-2 border-cyan-400 rounded-xl px-4 py-2.5 shadow-sm">
                      <span className="text-lg font-black text-slate-400">₹</span>
                      <input
                        type="number"
                        min={10}
                        max={99999}
                        step={50}
                        value={totalPrice}
                        onChange={(e) => handleTotalPriceChange(e.target.value)}
                        className="w-24 text-xl font-black text-cyan-700 focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className="text-xs text-slate-500">
                      <div className="font-semibold text-slate-700">Full route fare</div>
                      <div>Segments split proportionally</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add stop input */}
            <div className="flex gap-2 items-center z-10 relative">
              <div className="flex-1">
                <CityAutocomplete
                  value={newCity}
                  onChange={setNewCity}
                  placeholder="Add intermediate city (e.g. Vellore, Salem…)"
                  inputClass="text-sm font-semibold"
                />
              </div>
              <button
                onClick={handleAddStop}
                disabled={!newCity.trim() || addingStop}
                className="px-4 py-3 bg-cyan-600 disabled:bg-slate-300 text-white font-bold rounded-xl flex items-center gap-1.5 text-sm"
              >
                {addingStop
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Plus className="w-4 h-4" />
                }
                <span>{addingStop ? 'Locating…' : 'Add Stop'}</span>
              </button>
            </div>
            
            {/* Suggested Stops Chips */}
            {(loadingSuggestions || suggestedStops.length > 0) && (
              <div className="flex flex-wrap items-center gap-2 mt-2 mb-4 z-0">
                <span className="text-xs font-bold text-slate-400 uppercase mr-1">Suggested:</span>
                {loadingSuggestions ? (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Locating cities along route...
                  </span>
                ) : (
                  suggestedStops.map(s => (
                    <button
                      key={s}
                      onClick={() => handleAddStop(s)}
                      disabled={addingStop}
                      className="px-3 py-1.5 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200 rounded-full text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      + {s}
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Route timeline with km + auto price */}
            <div className="space-y-0">
              {cityStops.map((stop, i) => {
                const isFirst = i === 0;
                const isLast  = i === cityStops.length - 1;
                const isMid   = !isFirst && !isLast;
                const segKey  = i > 0 ? `${cityStops[i-1].city} \u2192 ${stop.city}` : null;
                const segKm   = i > 0 ? Math.max(1, stop.distance_km - cityStops[i-1].distance_km) : 0;
                const segPrice = segKey ? (segmentPrices[segKey] ?? Math.round(segKm * pricePerKm)) : null;

                return (
                  <div key={i} className="flex gap-3">
                    {/* Timeline spine */}
                    <div className="flex flex-col items-center w-8 flex-shrink-0">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 mt-3.5 z-10 ${
                        isFirst ? 'bg-cyan-500 border-cyan-500'
                        : isLast  ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-slate-400'
                      }`} />
                      {!isLast && (
                        <div className="w-0.5 flex-1 bg-slate-200 my-0.5" />
                      )}
                    </div>

                    {/* Stop card */}
                    <div className="flex-1 pb-3">
                      {/* Segment fare — editable inline */}
                      {i > 0 && (
                        <div className="flex items-center gap-2 mb-1.5 -mt-0.5">
                          <div className="text-[10px] text-slate-400 font-medium">{segKm} km</div>
                          <div className="h-px flex-1 bg-slate-100" />
                          {/* Proportion badge */}
                          <div className="text-[10px] text-slate-400 font-medium">
                            {Math.round((segKm / Math.max(1, cityStops[cityStops.length-1].distance_km)) * 100)}%
                          </div>
                          {/* Editable price chip */}
                          <div className="flex items-center gap-0.5 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                            <span className="text-[10px] font-bold text-emerald-600">₹</span>
                            <input
                              type="number"
                              min={10}
                              value={segPrice ?? ''}
                              onChange={(e) => setSegmentPrices({ ...segmentPrices, [segKey]: Number(e.target.value) })}
                              className="w-14 text-[11px] font-bold text-emerald-700 bg-transparent focus:outline-none text-right"
                            />
                          </div>
                        </div>
                      )}

                      <div className={`flex items-center justify-between p-3 rounded-xl border ${
                        isFirst ? 'bg-cyan-50 border-cyan-200'
                        : isLast  ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-4 h-4 ${
                            isFirst ? 'text-cyan-600' : isLast ? 'text-blue-600' : 'text-slate-400'
                          }`} />
                          <span className="text-sm font-bold text-slate-900">{stop.city}</span>
                          {stop.distance_km > 0 && (
                            <span className="text-xs text-slate-400 font-medium">
                              {stop.distance_km} km from start
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {isFirst && <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full">PICKUP</span>}
                          {isLast  && <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">DROP-OFF</span>}
                          {isMid && (
                            <button
                              onClick={() => handleRemoveStop(i)}
                              className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total summary bar */}
            {cityStops.length >= 2 && (
              <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-2xl">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Total Route</div>
                <div className="flex items-center gap-4 text-sm font-bold">
                  <span>{cityStops[cityStops.length-1].distance_km} km</span>
                  <span className="text-cyan-400">
                    ₹{totalPrice} set · ₹{Object.values(segmentPrices).reduce((s, v) => s + v, 0)} split
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setCurrentStep(3)} className="w-1/3 py-3.5 bg-slate-100 font-bold rounded-xl">&larr; Back</button>
              <button onClick={() => setCurrentStep(5)} className="w-2/3 py-3.5 bg-cyan-600 text-white font-bold rounded-xl">Next: Review Fares &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & EDIT SEGMENT FARES */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Step 5: Review Segment Fares</h2>
              <p className="text-xs text-slate-500 mt-1">Auto-calculated from km. Fine-tune any fare below.</p>
            </div>

            <div className="space-y-3">
              {Object.entries(segmentPrices).map(([segment, price]) => {
                const parts = segment.split(' \u2192 ');
                const fromStop = cityStops.find(s => s.city === parts[0]);
                const toStop   = cityStops.find(s => s.city === parts[1]);
                const km = toStop && fromStop ? Math.max(1, toStop.distance_km - fromStop.distance_km) : '?';
                return (
                  <div key={segment} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                    {/* Route label */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{segment}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {km} km · {Math.round((Number(km) / Math.max(1, cityStops[cityStops.length-1].distance_km)) * 100)}% of total · auto-split from ₹{totalPrice}
                      </div>
                    </div>
                    {/* Editable fare */}
                    <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5">
                      <span className="text-sm font-bold text-slate-400">₹</span>
                      <input
                        type="number" min={50}
                        value={price}
                        onChange={(e) => setSegmentPrices({ ...segmentPrices, [segment]: Number(e.target.value) })}
                        className="w-20 text-sm font-bold text-slate-900 focus:outline-none bg-transparent text-right"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grand total */}
            <div className="flex items-center justify-between px-4 py-3 bg-cyan-600 text-white rounded-2xl font-bold">
              <span>Total Route Fare</span>
              <span>₹{Object.values(segmentPrices).reduce((s, v) => s + v, 0)}</span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setCurrentStep(4)} className="w-1/3 py-3.5 bg-slate-100 font-bold rounded-xl">&larr; Back</button>
              <button onClick={() => setCurrentStep(6)} className="w-2/3 py-3.5 bg-cyan-600 text-white font-bold rounded-xl">Next: Select Seats &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 6: SEAT COUNT */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Step 6: Select Available Seat Count</h2>
            
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="text-5xl font-black text-cyan-600">{seatsAvailable}</div>
              <div className="text-xs font-bold text-slate-500 uppercase">Seats Offered</div>
              <input
                type="range"
                min={1}
                max={25}
                value={seatsAvailable}
                onChange={(e) => setSeatsAvailable(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setCurrentStep(5)} className="w-1/3 py-3.5 bg-slate-100 font-bold rounded-xl">&larr; Back</button>
              <button onClick={() => setCurrentStep(7)} className="w-2/3 py-3.5 bg-cyan-600 text-white font-bold rounded-xl">Next: Verify Driver Documents &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 7: DRIVER DOC VERIFICATION */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Step 7: Verify Driver Documents</h2>

            {docVerified ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span>Driver & Vehicle Verified!</span>
                </div>
                <p className="text-xs text-emerald-700">Driving License #{licenseNumber} & Vehicle RC #{rcNumber} confirmed.</p>
              </div>
            ) : (
              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Driving License Number</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Registration Certificate (RC)</label>
                  <input
                    type="text"
                    value={rcNumber}
                    onChange={(e) => setRcNumber(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>
                <button
                  onClick={handleVerifyDocs}
                  disabled={docLoading}
                  className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2"
                >
                  <FileCheck className="w-5 h-5" />
                  <span>{docLoading ? 'Verifying...' : 'Verify Documents Now'}</span>
                </button>
              </div>
            )}

            <div className="flex space-x-4">
              <button onClick={() => setCurrentStep(6)} className="w-1/3 py-3.5 bg-slate-100 font-bold rounded-xl">&larr; Back</button>
              <button
                disabled={!docVerified}
                onClick={() => setCurrentStep(8)}
                className={`w-2/3 py-3.5 font-bold rounded-xl ${docVerified ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Next: Review & Confirm &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: REVIEW & CONFIRM */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Step 8: Review & Confirm Public Ride</h2>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-sm">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Route:</span>
                <span className="font-bold text-slate-900">{pickup} &rarr; {dropoff}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-bold text-slate-900">{departureDate} at {departureTime}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Seats Available:</span>
                <span className="font-bold text-cyan-600">{seatsAvailable} Seats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">City Stops:</span>
                <span className="font-bold text-slate-900">{cityStops.map(s => s.city).join(' → ')}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setCurrentStep(7)} className="w-1/3 py-3.5 bg-slate-100 font-bold rounded-xl">&larr; Back</button>
              <button
                onClick={handleConfirmPublish}
                disabled={publishLoading}
                className="w-2/3 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg"
              >
                {publishLoading ? 'Publishing...' : 'Confirm & Publish Ride'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
