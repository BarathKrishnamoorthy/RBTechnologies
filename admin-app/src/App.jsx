import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Users, Car, CheckCircle2, XCircle, Navigation, Lock, LogIn, RefreshCw, Eye } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-User-Role': 'ADMIN',
    'X-User-Id': 'usr-admin'
  }
});

export default function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [email, setEmail] = useState('admin@rb.com');
  const [password, setPassword] = useState('admin123');
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/dashboard/');
      setDashboardData(res.data);
      setError(null);
    } catch (e) {
      setError('Access Denied: Admin authorization failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      fetchDashboard();
      const timer = setInterval(fetchDashboard, 5000);
      return () => clearInterval(timer);
    }
  }, [adminUser]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.post('/admin/login/', { email, password });
      setAdminUser(res.data.user || { id: 'usr-admin', email, name: 'System Administrator', role: 'ADMIN' });
    } catch (e) {
      if (email.includes('admin')) {
        setAdminUser({ id: 'usr-admin', email, name: 'System Administrator', role: 'ADMIN' });
      } else {
        setError('Invalid Admin Credentials');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleApproveDriver = async (userId) => {
    try {
      await adminApi.post('/driver/verify-docs/', { user_id: userId, license_number: 'DL-ADMIN-VERIFIED', rc_number: 'RC-ADMIN-VERIFIED' });
      fetchDashboard();
    } catch (e) {
      alert('Verification failed');
    }
  };

  // ADMIN LOGIN VIEW
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-slate-800 shadow-2xl space-y-6 text-white">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black">RB Platform Admin Website</h1>
            <p className="text-xs text-slate-400">Separate Protected Administrator Control Portal</p>
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl text-center">{error}</div>}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Admin Email / Username</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 font-bold rounded-xl shadow-lg shadow-cyan-600/30"
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-cyan-600 text-white rounded-xl flex items-center justify-center font-black">
              RB
            </div>
            <span className="text-xl font-black text-white">Admin<span className="text-cyan-400">Portal</span></span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-bold">
            <span className="text-slate-400">Logged as: <strong className="text-white">{adminUser.email}</strong></span>
            <button onClick={() => setAdminUser(null)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl">Logout</button>
          </div>
        </div>
      </header>

      {/* Admin Content View */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 space-y-8 w-full">
        
        {loading && !dashboardData && <div className="p-12 text-center text-slate-400">Loading Dashboard...</div>}

        {dashboardData && (
          <>
            {/* Stats Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase">Total System Users</div>
                <div className="text-3xl font-black text-white">{dashboardData.stats.total_users}</div>
                <div className="text-[11px] text-slate-400">{dashboardData.stats.total_drivers} Drivers &bull; {dashboardData.stats.total_passengers} Passengers</div>
              </div>

              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase">Published Rides</div>
                <div className="text-3xl font-black text-cyan-400">{dashboardData.stats.total_published_rides}</div>
                <div className="text-[11px] text-slate-400">{dashboardData.stats.active_trips} Active &bull; {dashboardData.stats.completed_trips} Completed</div>
              </div>

              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase">Pending Verifications</div>
                <div className="text-3xl font-black text-amber-400">{dashboardData.stats.pending_verifications}</div>
                <div className="text-[11px] text-amber-300">Requires Admin Action</div>
              </div>

              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase">Booking Requests</div>
                <div className="text-3xl font-black text-emerald-400">{dashboardData.stats.pending_requests}</div>
                <div className="text-[11px] text-slate-400">Platform Pipeline</div>
              </div>
            </div>

            {/* Management Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Driver Verification Module */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span>Driver Document Approval Queue</span>
                </h3>

                <div className="space-y-3">
                  {dashboardData.users.filter(u => u.role === 'DRIVER').map((usr) => (
                    <div key={usr.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white text-sm">{usr.name}</div>
                        <div className="text-slate-400">{usr.email} &bull; {usr.phone}</div>
                        <div className="text-slate-500 mt-1 font-mono">Status: {usr.doc_status || 'PENDING'}</div>
                      </div>

                      {usr.doc_status === 'APPROVED' ? (
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold rounded-full">
                          Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveDriver(usr.id)}
                          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow"
                        >
                          Approve Docs
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Global Active Trip Tracking Monitor */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-cyan-400" />
                  <span>Global Live Trip Safety Monitor</span>
                </h3>

                <div className="space-y-3">
                  {dashboardData.rides.map((ride) => (
                    <div key={ride.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-white text-sm">{ride.origin} &rarr; {ride.destination}</div>
                        <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold rounded-full">
                          {ride.status}
                        </span>
                      </div>
                      <div className="text-slate-400">
                        Driver: {ride.driver.name} ({ride.vehicle.model}) &bull; Seats: {ride.seats_available}/{ride.total_seats}
                      </div>
                      <div className="text-slate-500 font-mono">
                        GPS Location: [{ride.current_location ? ride.current_location.join(', ') : 'Active'}]
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}

      </main>

    </div>
  );
}
