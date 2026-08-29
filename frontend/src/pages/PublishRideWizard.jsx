import React, { useState } from 'react';
import { verifyDriverDocs, publishRideAdvanced } from '../api';
import { MapPin, Calendar, Clock, DollarSign, Car, ShieldCheck, CheckCircle2, Navigation, Plus, Trash2, FileCheck } from 'lucide-react';

export default function PublishRideWizard({ onPublishSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [pickup, setPickup] = useState('Chennai');
  const [dropoff, setDropoff] = useState('Bangalore');
  const [selectedRoute, setSelectedRoute] = useState('NH44 Express Route (345 km via Kanchipuram & Vellore)');
  
  // Intermediate City Stops
  const [cityStops, setCityStops] = useState([
    { city: 'Chennai', distance_km: 0 },
    { city: 'Kanchipuram', distance_km: 75 },
    { city: 'Vellore', distance_km: 140 },
    { city: 'Hosur', distance_km: 305 },
    { city: 'Bangalore', distance_km: 345 }
  ]);
  const [newCity, setNewCity] = useState('');

  // Segment Prices
  const [segmentPrices, setSegmentPrices] = useState({
    'Chennai-Kanchipuram': 150,
    'Chennai-Vellore': 250,
    'Chennai-Hosur': 500,
    'Chennai-Bangalore': 600,
    'Kanchipuram-Vellore': 120,
    'Vellore-Bangalore': 380
  });

  const [seatsAvailable, setSeatsAvailable] = useState(4);
  const [departureDate, setDepartureDate] = useState('2026-08-30');
  const [departureTime, setDepartureTime] = useState('06:30');
  
  // Driver Doc Verification
  const [licenseNumber, setLicenseNumber] = useState('DL-0420210088');
  const [rcNumber, setRcNumber] = useState('TN-07-RB-9988');
  const [docVerified, setDocVerified] = useState(false);
  const [docLoading, setDocLoading] = useState(false);

  const [publishLoading, setPublishLoading] = useState(false);

  const handleAddStop = () => {
    if (!newCity) return;
    setCityStops([...cityStops, { city: newCity, distance_km: 180 }]);
    setNewCity('');
  };

  const handleRemoveStop = (index) => {
    setCityStops(cityStops.filter((_, i) => i !== index));
  };

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
        driver_name: 'Karthik Driver',
        driver_phone: '+91 9876543210',
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
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-cyan-600" />
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Enter pickup city (e.g. Chennai)"
                className="w-full bg-transparent text-lg font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full py-3.5 bg-cyan-600 text-white font-bold rounded-xl"
            >
              Next: Select Drop-off Location &rarr;
            </button>
          </div>
        )}

        {/* STEP 2: DROPOFF */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Step 2: Select Drop-off Location</h2>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-cyan-600" />
              <input
                type="text"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                placeholder="Enter final destination city (e.g. Bangalore)"
                className="w-full bg-transparent text-lg font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setCurrentStep(1)} className="w-1/3 py-3.5 bg-slate-100 font-bold rounded-xl">&larr; Back</button>
              <button onClick={() => setCurrentStep(3)} className="w-2/3 py-3.5 bg-cyan-600 text-white font-bold rounded-xl">Next: Select Route &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 3: ROUTE SELECTION & MAP */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Step 3: Select Preferred Route Options</h2>
            
            {/* Interactive Route Selector */}
            <div className="space-y-3">
              {[
                { title: 'NH44 Express Route (345 km via Kanchipuram & Vellore)', time: '6h 00m', badge: 'Fastest' },
                { title: 'NH75 Highway Route (360 km via Chittoor)', time: '6h 30m', badge: 'Less Tolls' }
              ].map((r, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedRoute(r.title)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                    selectedRoute === r.title ? 'border-cyan-600 bg-cyan-50/50' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{r.title}</div>
                    <span className="text-xs text-slate-500">{r.time} estimated travel time</span>
                  </div>
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-bold rounded-full">{r.badge}</span>
                </div>
              ))}
            </div>

            {/* Map Placeholder Graphic */}
            <div className="h-48 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white p-4 text-center space-y-2 border border-slate-700">
              <Navigation className="w-8 h-8 text-cyan-400 animate-pulse" />
              <div className="font-bold text-sm">Interactive GPS Route Preview</div>
              <div className="text-xs text-slate-400">{selectedRoute}</div>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setCurrentStep(2)} className="w-1/3 py-3.5 bg-slate-100 font-bold rounded-xl">&larr; Back</button>
              <button onClick={() => setCurrentStep(4)} className="w-2/3 py-3.5 bg-cyan-600 text-white font-bold rounded-xl">Next: Add City Stops &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 4: ADD CITY STOPS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Step 4: Add Intermediate City Stops</h2>
            <p className="text-xs text-slate-500">Add cities along your route where you can pick up or drop off passengers.</p>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Add intermediate city (e.g. Krishnagiri)"
                className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
              <button
                onClick={handleAddStop}
                className="px-4 py-3 bg-cyan-600 text-white font-bold rounded-xl flex items-center space-x-1 text-sm"
              >
                <Plus className="w-4 h-4" /> <span>Add Stop</span>
              </button>
            </div>

            <div className="space-y-2">
              {cityStops.map((stop, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div className="flex items-center space-x-3 text-sm font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs">{i+1}</span>
                    <span>{stop.city}</span>
                  </div>
                  {i > 0 && i < cityStops.length - 1 && (
                    <button onClick={() => handleRemoveStop(i)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setCurrentStep(3)} className="w-1/3 py-3.5 bg-slate-100 font-bold rounded-xl">&larr; Back</button>
              <button onClick={() => setCurrentStep(5)} className="w-2/3 py-3.5 bg-cyan-600 text-white font-bold rounded-xl">Next: Set City Segment Prices &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 5: CITY-WISE PRICING */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Step 5: Set City-to-City Segment Fares</h2>
            <p className="text-xs text-slate-500">Set fare for passengers boarding or getting off at intermediate stops.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(segmentPrices).map(([segment, price]) => (
                <div key={segment} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">{segment}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setSegmentPrices({ ...segmentPrices, [segment]: Number(e.target.value) })}
                      className="w-20 p-1 bg-white border border-slate-300 rounded text-sm font-bold text-right"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setCurrentStep(4)} className="w-1/3 py-3.5 bg-slate-100 font-bold rounded-xl">&larr; Back</button>
              <button onClick={() => setCurrentStep(6)} className="w-2/3 py-3.5 bg-cyan-600 text-white font-bold rounded-xl">Next: Select Seat Count &rarr;</button>
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
