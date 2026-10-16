import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle, 
  PhoneCall, 
  Radio, 
  Lock, 
  HeartHandshake, 
  CheckCircle2, 
  Car, 
  Navigation, 
  Sparkles, 
  ShieldAlert, 
  Award,
  Phone,
  Mail,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Safety() {
  const [activeTab, setActiveTab] = useState('passengers'); // 'passengers' | 'drivers'

  const safetyPillars = [
    {
      icon: UserCheck,
      title: '100% Government ID Verification',
      desc: 'Every driver must submit a valid Driving License, Vehicle Registration Certificate (RC), and Government photo identity. Accounts are verified before trips can be published.',
      badge: 'Mandatory Verification'
    },
    {
      icon: Radio,
      title: 'Real-Time Device GPS Tracking',
      desc: 'Every active ride broadcasts continuous device GPS updates. Co-travelers and their families can view live road progress, intermediate highway stops, and exact ETA.',
      badge: 'Live GPS'
    },
    {
      icon: PhoneCall,
      title: '24/7 Emergency SOS Assistance',
      desc: 'One-touch SOS access during any ongoing trip. Instantly dispatch your live location to your trusted emergency contacts and connect with national emergency dispatchers (112).',
      badge: 'Rapid Response'
    },
    {
      icon: Lock,
      title: 'Privacy & Number Protection',
      desc: 'Your personal phone number and contact details are masked and only revealed to confirmed co-travelers shortly before departure for seamless pickup coordination.',
      badge: 'Data Security'
    },
    {
      icon: Car,
      title: 'Vehicle Roadworthiness Standards',
      desc: 'All vehicles (Sedan, Hatchback, SUV, Van, and Bike) must comply with state transport rules. Mandatory helmets for two-wheelers and seatbelts for all car occupants.',
      badge: 'Highway Compliant'
    },
    {
      icon: Award,
      title: 'Two-Way Rating & Accountability',
      desc: 'Both co-travelers and drivers rate each other after every drop-off. Strict community guidelines with automatic suspension for any driver with low safety ratings.',
      badge: 'Community Trust'
    }
  ];

  const passengerTips = [
    {
      title: 'Always Match Vehicle & Plate Number',
      detail: 'Before boarding, compare the car make, model, color, and license plate with the details displayed on your RB Rides booking ticket.'
    },
    {
      title: 'Share Your Live Trip with Family',
      detail: 'Use the "Share Live Tracking" link in your dashboard to send a live GPS tracker to your family or friends with one tap via WhatsApp or SMS.'
    },
    {
      title: 'Meet at Designated Public Hubs',
      detail: 'Coordinate pickup and drop-off at well-lit, popular transit hubs like metro stations, highway toll plazas, or major bus terminals.'
    },
    {
      title: 'Report Any Discrepancy Immediately',
      detail: 'If a driver brings an unlisted vehicle or attempts to collect unauthorized additional fares, cancel the ride and alert our safety team immediately.'
    }
  ];

  const driverTips = [
    {
      title: 'Stick to Designated Highway Corridors',
      detail: 'Follow the agreed route and published intermediate stops. Never deviate into unverified paths without passenger consent.'
    },
    {
      title: 'Adhere to Highway Speed Limits & Rest Stops',
      detail: 'Drive with caution, respect Indian national highway speed regulations, and schedule periodic 10-minute rest breaks on long 400+ km journeys.'
    },
    {
      title: 'Verify Passenger Name at Pickup',
      detail: 'Always cross-check the passenger name and phone number on your driver console before starting the trip.'
    },
    {
      title: 'Zero Tolerance for Impaired Driving',
      detail: 'Strict zero-tolerance policy for driving under the influence or using mobile phones while driving on high-speed corridors.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF9FF] text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-900 pt-28 pb-20 overflow-x-hidden">
      
      {/* Dynamic Purple Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-b from-purple-200/50 via-violet-100/30 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-purple-100/60 blur-[110px] rounded-full" />
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-indigo-100/50 blur-[120px] rounded-full" />
        
        {/* Crisp Dot Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotPatternSafety" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#8B5CF6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPatternSafety)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs sm:text-sm font-semibold shadow-sm mb-2">
            <ShieldCheck className="w-4 h-4 text-purple-700" />
            <span>Trust &amp; Safety First at RB Rides</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Your Safety is Our{' '}
            <span className="bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Uncompromising Priority
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Whether traveling between Chennai, Bengaluru, Mumbai, or Pune, our comprehensive safety framework ensures verified travelers, secure GPS tracking, and 24/7 assistance on every corridor.
          </p>
        </div>

        {/* 6 Core Safety Pillars Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Our 6-Layer Safety Protection Framework
            </h2>
            <p className="text-slate-500 text-sm mt-1">Built to provide peace of mind before, during, and after every ride.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={idx}
                  className="group bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-[0_10px_30px_rgba(124,58,237,0.06)] hover:shadow-[0_16px_40px_rgba(124,58,237,0.14)] hover:border-purple-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 group-hover:scale-110 group-hover:bg-purple-100 transition-all">
                        <Icon className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-900 transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-purple-50 flex items-center text-purple-700 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                    <span>Active on all routes</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Women Safety & Pink Rides Callout */}
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-purple-500/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-purple-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
              <span>Inclusive &amp; Respectful Carpooling</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Women Co-Travelers &amp; Verified Travel Preferences
            </h3>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              We empower female passengers and drivers to travel with absolute confidence. Our search filters allow women travelers to choose rides offered by verified female drivers or co-passengers for maximum comfort during intercity transit.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-purple-200">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Female Profiles
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <Users className="w-4 h-4 text-purple-300" />
                Women-Only Carpool Options
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <PhoneCall className="w-4 h-4 text-pink-400" />
                Dedicated Safety Support Hotline
              </span>
            </div>
          </div>
        </div>

        {/* Safety Guidelines Interactive Section (Passengers vs Drivers) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-[0_12px_36px_rgba(124,58,237,0.08)] space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Best Practices &amp; Guidelines</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Proven rules that guarantee smooth, incident-free trips.</p>
            </div>

            {/* Toggle Pills */}
            <div className="inline-flex p-1 bg-purple-50 rounded-2xl border border-purple-200">
              <button
                type="button"
                onClick={() => setActiveTab('passengers')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'passengers'
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-purple-900'
                }`}
              >
                For Passengers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('drivers')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'drivers'
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-purple-900'
                }`}
              >
                For Drivers
              </button>
            </div>
          </div>

          {/* Cards for Active Tab */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(activeTab === 'passengers' ? passengerTips : driverTips).map((tip, idx) => (
              <div 
                key={idx}
                className="p-5 sm:p-6 bg-[#FAF9FF] rounded-2xl border border-purple-100/90 space-y-2.5 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 font-extrabold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {tip.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pl-9">
                  {tip.detail}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Community Guidelines Code of Conduct Banner */}
        <div className="rounded-3xl p-8 sm:p-10 border border-purple-200 bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/50 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Zero-Tolerance Safety Policy</h3>
              <p className="text-xs text-slate-500">Every member agrees to maintain strict decorum on RB Rides.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-700">
            <div className="p-4 bg-white rounded-2xl border border-purple-100 space-y-1.5 shadow-xs">
              <span className="text-purple-700 font-bold block">🚫 No Harassment</span>
              <p className="text-slate-500 font-normal">Zero tolerance for disrespectful language, unwelcome behavior, or intrusive inquiries.</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-purple-100 space-y-1.5 shadow-xs">
              <span className="text-purple-700 font-bold block">🚭 Clean &amp; Smoke-Free</span>
              <p className="text-slate-500 font-normal">Smoking, alcohol, and prohibited substances are strictly banned in all carpool vehicles.</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-purple-100 space-y-1.5 shadow-xs">
              <span className="text-purple-700 font-bold block">⏱️ Punctuality Guarantee</span>
              <p className="text-slate-500 font-normal">Both drivers and passengers must arrive at agreed pickup points promptly at the scheduled time.</p>
            </div>
          </div>
        </div>

        {/* 24/7 Support & Emergency Contact Card */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-[0_12px_36px_rgba(124,58,237,0.08)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">Need Immediate Safety Support?</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Our safety response team is available 24/7 to resolve queries, investigate feedback, and assist in emergencies.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
            <a
              href="tel:+919876543210"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210 (24/7)</span>
            </a>

            <Link
              to="/help"
              className="px-5 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs sm:text-sm transition-all"
            >
              Contact Support Center
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
