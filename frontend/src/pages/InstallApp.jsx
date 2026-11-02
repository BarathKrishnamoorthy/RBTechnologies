import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Apple, CheckCircle2, QrCode, ArrowRight, ShieldCheck, Share2, PlusSquare } from 'lucide-react';

export default function InstallApp() {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      setIsIOS(true);
    } else if (/android/i.test(ua)) {
      setIsAndroid(true);
    }
  }, []);

  const apkDownloadUrl = 'https://github.com/BarathKrishnamoorthy/bla/releases/download/v1.0.0/hellobro.apk';

  return (
    <div className="min-h-screen bg-[#FAF9FF] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Hero Banner */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <img src="/hello_bro_logo.png" alt="Hello Bro" className="h-16 w-auto object-contain" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-900 font-extrabold text-xs shadow-xs">
            <Smartphone className="w-4 h-4 text-purple-700" />
            <span>Official Mobile Applications</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Install <span className="bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 bg-clip-text text-transparent">Hello Bro</span> on Your Phone
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto font-normal">
            Get instant access to verified carpooling, live GPS trip tracking, emergency SOS, and seamless seat booking on Android and iOS.
          </p>
        </div>

        {/* Two Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* ANDROID CARD */}
          <div className={`p-8 rounded-3xl bg-white border ${isAndroid ? 'border-purple-600 ring-2 ring-purple-600/20' : 'border-purple-100'} shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between space-y-6`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-2xl border border-emerald-200">
                  🤖
                </div>
                {isAndroid && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    Your Device Detected
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Android App</h3>
                <p className="text-xs text-slate-500 mt-1">Direct APK Package • Compatible with Android 8.0+</p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time GPS Tracking with Driver Dialing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fast, lightweight offline support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No Play Store login required</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <a
                href={apkDownloadUrl}
                download="hellobro.apk"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                <Download className="w-5 h-5" />
                <span>Download Android APK</span>
              </a>
              <p className="text-[11px] text-center text-slate-400">
                Tap downloaded file to install. Allow "Install from this source" if prompted.
              </p>
            </div>
          </div>

          {/* IOS CARD */}
          <div className={`p-8 rounded-3xl bg-white border ${isIOS ? 'border-purple-600 ring-2 ring-purple-600/20' : 'border-purple-100'} shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between space-y-6`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-black text-2xl border border-purple-200">
                  <Apple className="w-8 h-8" />
                </div>
                {isIOS && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                    Your Device Detected
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Apple iOS App</h3>
                <p className="text-xs text-slate-500 mt-1">iPhone & iPad Standalone App • Full Screen</p>
              </div>

              <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 space-y-3 text-xs text-slate-700">
                <div className="font-extrabold text-purple-950 flex items-center gap-1.5">
                  <span>How to install on iPhone (2 taps):</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                    <span>Tap the Safari <strong>Share button</strong> (<Share2 className="w-3.5 h-3.5 inline mx-0.5 text-purple-700" />) at the bottom.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                    <span>Scroll down and tap <strong>Add to Home Screen</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-purple-700" />).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center text-[10px] font-black shrink-0">3</span>
                    <span>Tap <strong>Add</strong>. Hello Bro is now on your home screen!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  alert("To install on iOS:\n1. Tap the Share icon in Safari (at bottom)\n2. Select 'Add to Home Screen'\n3. Tap 'Add'");
                }}
                className="w-full py-4 px-6 rounded-2xl bg-slate-900 text-white font-extrabold flex items-center justify-center gap-3 shadow-md hover:bg-slate-800 transition-all text-sm cursor-pointer"
              >
                <Apple className="w-5 h-5" />
                <span>Add to iPhone Home Screen</span>
              </button>
              <p className="text-[11px] text-center text-slate-400">
                Runs full-screen with native gestures and zero App Store wait.
              </p>
            </div>
          </div>

        </div>

        {/* QR Code Card for Desktop Viewers */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-purple-200">
              Instant Mobile Scan
            </span>
            <h4 className="text-xl sm:text-2xl font-black">Scan to open on your phone</h4>
            <p className="text-xs text-purple-200/80 max-w-md">
              Point your iPhone or Android camera at this QR code to immediately open and install Hello Bro.
            </p>
          </div>
          <div className="p-3 bg-white rounded-2xl shrink-0 shadow-lg">
            {/* SVG QR Code representation */}
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://rbtechnologiesproject.web.app/install"
              alt="Scan to Install Hello Bro"
              className="w-28 h-28 object-contain"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
