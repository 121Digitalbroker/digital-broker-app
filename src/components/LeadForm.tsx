"use client";
import React, { useState } from 'react';
import { Send, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

interface LeadFormProps {
  propertyId: string;
  propertyTitle: string;
  onSuccess?: () => void;
}

export default function LeadForm({ propertyId, propertyTitle, onSuccess }: LeadFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
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
          propertyId,
          propertyTitle
        })
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '' });
        onSuccess?.();
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
      <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center animate-fade-in">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h4 className="text-xl font-bold text-white mb-2">Request Received!</h4>
        <p className="text-green-200 text-sm">Our relationship manager will contact you within 24 hours.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-6 text-xs font-bold text-white underline underline-offset-4 opacity-60 hover:opacity-100"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Your Name" 
          required
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-blue-300 focus:outline-none focus:border-orange-500 transition-all text-sm"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          required
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-blue-300 focus:outline-none focus:border-orange-500 transition-all text-sm"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
        />
        <input 
          type="tel" 
          placeholder="Phone Number" 
          required
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-blue-300 focus:outline-none focus:border-orange-500 transition-all text-sm"
          value={form.phone}
          onChange={(e) => setForm({...form, phone: e.target.value})}
        />
      </div>

      <button 
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white py-5 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-orange-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 group mt-4"
      >
        {status === 'loading' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>Request Callback <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
        )}
      </button>
      
      {status === 'error' && (
        <p className="text-red-400 text-xs text-center font-bold">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
