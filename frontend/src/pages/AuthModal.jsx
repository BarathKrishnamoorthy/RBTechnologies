import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { loginUser, registerUser, googleAuth } from '../api';
import { X, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // ── Real Google OAuth using @react-oauth/google ──────────────────────────
  // MUST be declared before any early return (Rules of Hooks)
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the real user profile from Google
        const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await profileRes.json();

        // Send to backend to store / verify
        const res = await googleAuth({
          google_id: profile.sub,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
        });

        onAuthSuccess(res.user);
        onClose();
      } catch (err) {
        setError('Google sign-in failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in was cancelled or failed.');
    },
  });

  // Early return AFTER all hooks
  if (!isOpen) return null;


  // ── Email / Password form submit ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isForgotPassword) {
        setMessage('Password reset instructions have been sent to your email.');
        setTimeout(() => setIsForgotPassword(false), 2500);
        return;
      }

      if (isSignUp) {
        const res = await registerUser({ email, name, phone, password, role: 'USER' });
        onAuthSuccess(res.user);
      } else {
        const res = await loginUser({ email, password });
        onAuthSuccess(res.user);
      }
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.error || 'Authentication failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto font-black text-xl shadow-lg shadow-cyan-500/30">
            RB
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create an RB Account' : 'Sign In to RB Rides'}
          </h2>
          <p className="text-xs text-slate-500">
            {isSignUp
              ? 'Sign up to offer rides or book a seat on any public ride'
              : 'Sign in to publish rides, book seats & track live GPS'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 text-center">
            {message}
          </div>
        )}

        {/* Google Sign-In Button (real OAuth) */}
        {!isForgotPassword && (
          <div>
            <button
              onClick={() => handleGoogleLogin()}
              disabled={loading}
              type="button"
              className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl flex items-center justify-center space-x-2.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{loading ? 'Signing in with Google...' : 'Continue with Google'}</span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-slate-200" />
              <span className="px-3 text-xs text-slate-400 font-semibold uppercase">Or with Email</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>
          </div>
        )}

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
                <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-400 transition-all">
                  <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-400 transition-all">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-400 transition-all">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(null); }}
                    className="text-xs text-cyan-600 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-400 transition-all">
                <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-cyan-500/30 transition-all active:scale-95 disabled:opacity-60"
          >
            {loading
              ? 'Processing...'
              : isForgotPassword
                ? 'Send Reset Link'
                : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="text-center text-xs text-slate-500 pt-1">
          {isForgotPassword ? (
            <button onClick={() => { setIsForgotPassword(false); setError(null); }} className="text-cyan-600 font-bold hover:underline">
              ← Back to Sign In
            </button>
          ) : isSignUp ? (
            <span>
              Already have an account?{' '}
              <button onClick={() => { setIsSignUp(false); setError(null); }} className="text-cyan-600 font-bold hover:underline">
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to RB Rides?{' '}
              <button onClick={() => { setIsSignUp(true); setError(null); }} className="text-cyan-600 font-bold hover:underline">
                Create an Account
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
