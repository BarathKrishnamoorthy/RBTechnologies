import React from 'react';
import { ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

export default function Safety() {
  return (
    <div className="pt-28 pb-16 min-h-screen bg-brand-offwhite">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-brand-dark tracking-tight">Your Safety is Our Priority</h1>
          <p className="text-lg text-brand-dark/70 max-w-2xl mx-auto">
            At RB Rides, we are committed to ensuring every journey is secure, comfortable, and reliable.
          </p>
        </div>

        {/* Content Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-white/40 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-brand-lightblue/20 text-brand-deepblue rounded-xl">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark">Verified Profiles</h3>
            </div>
            <p className="text-brand-dark/70 leading-relaxed">
              Every driver and passenger on RB Rides is required to verify their identity. We verify driving licenses, vehicle registration certificates (RC), and contact information before allowing users to publish or book rides.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-white/40 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark">Emergency Support</h3>
            </div>
            <p className="text-brand-dark/70 leading-relaxed">
              In the unlikely event of an emergency, our support team is available 24/7. You can use our SOS feature during a live trip to instantly alert authorities and your emergency contacts with your live GPS location.
            </p>
          </div>
        </div>

        <div className="bg-brand-deepblue text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Community Guidelines</h2>
          <p className="text-brand-lightblue mb-8 max-w-2xl mx-auto">
            We rely on our community to maintain a safe environment. Please report any suspicious activity, reckless driving, or inappropriate behavior immediately.
          </p>
          <ul className="text-left max-w-xl mx-auto space-y-3 font-medium">
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span>Always wear your seatbelt.</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span>Respect other members' personal space and preferences.</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span>Do not carry prohibited items in the vehicle.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
