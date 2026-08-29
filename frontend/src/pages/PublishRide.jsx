import React, { useState } from 'react';
import { publishRide } from '../api';
import { MapPin, Calendar, Clock, DollarSign, Car, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PublishRide({ onPublishSuccess }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('08:00');
  const [arrivalTime, setArrivalTime] = useState('11:00');
  const [price, setPrice] = useState(450);
  const [seatsAvailable, setSeatsAvailable] = useState(3);
  const [vehicleModel, setVehicleModel] = useState('Honda City (White)');
  const [plateNumber, setPlateNumber] = useState('MH 12 RB 8899');
  const [driverName, setDriverName] = useState('Rahul Sharma');
  const [driverPhone, setDriverPhone] = useState('+91 9822001122');
  const [hasAc, setHasAc] = useState(true);
  const [instantBooking, setInstantBooking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate) {
      setError('Please fill in Origin, Destination, and Departure Date.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const createdRide = await publishRide({
        origin,
        destination,
        origin_address: `${origin} Main Bus Station`,
        destination_address: `${destination} City Center`,
        departure_date: departureDate,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        duration: '3h 00m',
        price: Number(price),
        seats_available: Number(seatsAvailable),
        total_seats: Number(seatsAvailable),
        instant_booking: instantBooking,
        driver_name: driverName,
        driver_phone: driverPhone,
        vehicle_model: vehicleModel,
        plate_number: plateNumber,
        has_ac: hasAc
      });

      setSuccess(true);
      setTimeout(() => {
        onPublishSuccess(createdRide.id);
      }, 1500);
    } catch (err) {
      setError('Failed to publish ride. Please check Django server connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
        
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Publish a Ride</h1>
          <p className="text-slate-500 text-sm">
            Offer empty seats in your car to passengers heading the same way. Save fuel costs!
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-sm font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Ride published successfully! Redirecting to search...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Route Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pick-up Location (Origin)</label>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <MapPin className="w-5 h-5 text-cyan-600" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Drop-off Location (Destination)</label>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <MapPin className="w-5 h-5 text-cyan-600" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Departure Date</label>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <Calendar className="w-4 h-4 text-cyan-600" />
                <input
                  type="date"
                  required
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Departure Time</label>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <Clock className="w-4 h-4 text-cyan-600" />
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estimated Arrival</label>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <Clock className="w-4 h-4 text-cyan-600" />
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price per seat (₹)</label>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <DollarSign className="w-5 h-5 text-cyan-600" />
                <input
                  type="number"
                  min={100}
                  max={5000}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Available Passenger Seats</label>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <Car className="w-5 h-5 text-cyan-600" />
                <select
                  value={seatsAvailable}
                  onChange={(e) => setSeatsAvailable(Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none"
                >
                  <option value={1}>1 seat</option>
                  <option value={2}>2 seats</option>
                  <option value={3}>3 seats</option>
                  <option value={4}>4 seats</option>
                </select>
              </div>
            </div>
          </div>

          {/* Driver & Car Details */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Vehicle & Driver Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Driver Full Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Vehicle Model & Color</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={hasAc}
                  onChange={(e) => setHasAc(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded"
                />
                <span>Air Conditioning (AC)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={instantBooking}
                  onChange={(e) => setInstantBooking(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded"
                />
                <span>Instant Seat Booking</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-cyan-600/30 transition-transform active:scale-98"
          >
            {loading ? 'Publishing...' : 'Publish Ride Now'}
          </button>

        </form>

      </div>
    </div>
  );
}
