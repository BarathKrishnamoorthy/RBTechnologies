import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react';

export default function Help() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send the form data to an API
  };

  const faqs = [
    {
      q: "How do I book a ride?",
      a: "Simply enter your origin and destination in the search bar, pick a ride that suits you, and click 'Send Ride Request'."
    },
    {
      q: "How do I get paid as a driver?",
      a: "Currently, payments are handled in cash or UPI directly between the passenger and driver during the ride."
    },
    {
      q: "What happens if a driver cancels?",
      a: "If a driver cancels, we will notify you immediately and help you find alternative rides on the same route."
    }
  ];

  return (
    <div className="pt-28 pb-16 min-h-screen bg-brand-offwhite">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-brand-dark tracking-tight">How Can We Help You?</h1>
          <p className="text-lg text-brand-dark/70 max-w-2xl mx-auto">
            Find answers to common questions or reach out to our support team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* FAQ Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-dark flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-brand-deepblue" />
              <span>Common Queries</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Us Form */}
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white shadow-xl">
            <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center space-x-2">
              <Phone className="w-6 h-6 text-brand-deepblue" />
              <span>Contact Us</span>
            </h2>
            
            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center space-y-2">
                <p className="font-bold">Thank you for reaching out!</p>
                <p className="text-sm">We have received your message and will get back to you shortly.</p>
                <button 
                  onClick={() => { setSubmitted(false); setMessage(''); }}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-deepblue focus:border-brand-deepblue outline-none transition"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-deepblue focus:border-brand-deepblue outline-none transition"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                  <textarea
                    required
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-deepblue focus:border-brand-deepblue outline-none transition resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-deepblue hover:bg-opacity-90 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
