"use client";
import React, { useState } from 'react';
import { Send, CheckCircle, ArrowRight, Loader2, Calendar } from 'lucide-react';

export default function HomeBookingForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          propertyTitle: 'General Booking / Appointment',
          message: `Requested Booking Date: ${form.date}`
        })
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', date: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-10 text-center animate-fade-in max-w-lg mx-auto">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h4 className="text-3xl font-bold text-white mb-4">Booking Received!</h4>
        <p className="text-green-200 text-lg">Our team will contact you shortly to confirm your appointment details.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-8 font-bold text-white underline underline-offset-4 opacity-60 hover:opacity-100"
        >
          Book another appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto text-left relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
           <label className="text-sm font-bold text-blue-200 ml-2">Full Name</label>
           <input 
             type="text" 
             placeholder="John Doe" 
             required
             className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
             value={form.name}
             onChange={(e) => setForm({...form, name: e.target.value})}
           />
        </div>
        <div className="space-y-2">
           <label className="text-sm font-bold text-blue-200 ml-2">Phone Number</label>
           <input 
             type="tel" 
             placeholder="+91 98765 43210" 
             required
             className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
             value={form.phone}
             onChange={(e) => setForm({...form, phone: e.target.value})}
           />
        </div>
      </div>
      
      <div className="space-y-2">
         <label className="text-sm font-bold text-blue-200 ml-2">Email Address</label>
         <input 
           type="email" 
           placeholder="john@example.com" 
           required
           className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all"
           value={form.email}
           onChange={(e) => setForm({...form, email: e.target.value})}
         />
      </div>

      <div className="space-y-2">
         <label className="text-sm font-bold text-blue-200 ml-2 flex items-center gap-2">
           <Calendar className="w-4 h-4" /> Preferred Date
         </label>
         <input 
           type="date"
           required
           className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all [color-scheme:dark]"
           value={form.date}
           onChange={(e) => setForm({...form, date: e.target.value})}
         />
      </div>

      <button 
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 flex items-center justify-center gap-3 group mt-8"
      >
        {status === 'loading' ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>Book Now <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
        )}
      </button>
      
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center font-bold mt-4">Something went wrong. Please try again or contact us directly.</p>
      )}
    </form>
  );
}
