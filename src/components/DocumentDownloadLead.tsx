"use client";

import React, { useState } from 'react';
import { X, Download, CheckCircle, Loader2 } from 'lucide-react';

interface DocumentDownloadLeadProps {
  propertyId: string;
  propertyTitle: string;
  documentType: string;
  documentUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentDownloadLead({
  propertyId,
  propertyTitle,
  documentType,
  documentUrl,
  isOpen,
  onClose
}: DocumentDownloadLeadProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

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
          propertyTitle,
          documentType
        })
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '' });
        // If there's a document URL, trigger download after a brief delay
        if (documentUrl) {
          setTimeout(() => {
            window.open(documentUrl, '_blank');
          }, 1500);
        }
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#0a1628] mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-4">
              Your download will start automatically. Our team will also contact you shortly.
            </p>
            {documentUrl && (
              <a 
                href={documentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
              >
                <Download className="w-4 h-4" />
                Download Now
              </a>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-[#0a1628]">Download {documentType}</h3>
              <p className="text-gray-500 text-sm mt-1">
                Please fill in your details to download this document
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-orange-500 transition-all"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-orange-500 transition-all"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-orange-500 transition-all"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Document
                  </>
                )}
              </button>

              {status === 'error' && (
                <p className="text-red-500 text-xs text-center font-bold">
                  Something went wrong. Please try again.
                </p>
              )}

              <p className="text-xs text-gray-400 text-center mt-4">
                By submitting, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
