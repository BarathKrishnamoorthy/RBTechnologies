import React, { useState, useEffect } from 'react';
import { getAdminDashboard, verifyDriverDocs } from '../api';
import { ShieldCheck, Users, Car, CheckCircle2, XCircle, Navigation, BarChart3, AlertCircle } from 'lucide-react';

export default function AdminPortal() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await getAdminDashboard();
      setData(res);
    } catch (e) {
      setError('Access Denied: Admin privileges required.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveDriver = async (userId) => {
    try {
      await verifyDriverDocs({ user_id: userId, license_number: 'DL-ADMIN-VERIFIED', rc_number: 'RC-ADMIN-VERIFIED' });
      fetchAdminData();
    } catch (e) {
      alert('Action failed');
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading Admin System Dashboard...</div>;
  if (error || !data) return <div className="p-12 text-center text-red-600 font-bold">{error || 'Failed to load dashboard'}</div>;

  const { stats, users, rides, requests } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase mb-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>RB System Admin Control Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold">Platform Administration</h1>
          <p className="text-xs text-slate-400 mt-1">Manage users, drivers, document verifications, rides, and global trip safety.</p>
        </div>
        <div className="px-4 py-2 bg-cyan-500/20 text-cyan-300 font-bold text-xs rounded-2xl border border-cyan-400/30">
          Super Admin Mode
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Users</div>
          <div className="text-3xl font-black text-slate-900">{stats.total_users}</div>
          <div className="text-[11px] text-slate-500">{stats.total_drivers} Drivers &bull; {stats.total_passengers} Passengers</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Rides</div>
          <div className="text-3xl font-black text-cyan-600">{stats.total_published_rides}</div>
          <div className="text-[11px] text-slate-500">{stats.active_trips} Active &bull; {stats.completed_trips} Completed</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Pending Verifications</div>
          <div className="text-3xl font-black text-amber-500">{stats.pending_verifications}</div>
          <div className="text-[11px] text-amber-600 font-semibold">Requires Action</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Pending Requests</div>
          <div className="text-3xl font-black text-emerald-600">{stats.pending_requests}</div>
          <div className="text-[11px] text-slate-500">Booking Pipeline</div>
        </div>
      </div>

      {/* Driver Verification Queue & User Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Verification Queue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-600" />
            <span>Driver Document Approval Queue</span>
          </h3>

          <div className="space-y-3">
            {users.filter(u => u.role === 'DRIVER').map((usr) => (
              <div key={usr.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{usr.name}</div>
                  <div className="text-xs text-slate-500">{usr.email} &bull; Phone: {usr.phone}</div>
                  <div className="text-xs text-slate-600 mt-1 font-semibold">
                    License: {usr.license_number || 'Uploaded'} | RC: {usr.rc_number || 'Uploaded'}
                  </div>
                </div>

                {usr.doc_status === 'APPROVED' ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    Verified
                  </span>
                ) : (
                  <button
                    onClick={() => handleApproveDriver(usr.id)}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow"
                  >
                    Approve Docs
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Global Rides & Safety Tracking Monitor */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-cyan-600" />
            <span>Global Live Trip Safety Monitor</span>
          </h3>

          <div className="space-y-3">
            {rides.map((ride) => (
              <div key={ride.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-slate-900 text-sm">{ride.origin} &rarr; {ride.destination}</div>
                  <span className="px-2.5 py-0.5 bg-cyan-100 text-cyan-800 text-xs font-bold rounded-full">
                    {ride.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Driver: {ride.driver.name} ({ride.vehicle.model}) &bull; Seats: {ride.seats_available}/{ride.total_seats}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  GPS: [{ride.current_location ? ride.current_location.join(', ') : 'Active'}]
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
