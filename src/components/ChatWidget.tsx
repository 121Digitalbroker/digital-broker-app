"use client";
import React, { useState } from 'react';
import { MessageCircle, X, Send, CheckCircle } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'chat' }),
      });
      if (res.ok) setFormSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="font-bold text-sm max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Chat with us
          </span>
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden border border-gray-100">
          <div className="bg-[#0a1628] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Digital Broker</h4>
                <p className="text-gray-400 text-xs">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 max-h-96 overflow-y-auto">
            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-sm text-gray-600 mb-4 bg-gray-100 p-3 rounded-xl rounded-tl-none">
                  Hi! 👋 Interested in properties? Leave your details and we'll call you.
                </p>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-500 transition-colors"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-500 transition-colors"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-500 transition-colors"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <textarea
                  placeholder="Message..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-500 transition-colors resize-none"
                  rows={2}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send</>}
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h5 className="font-bold text-[#0a1628]">Details Sent!</h5>
                <p className="text-sm text-gray-500">We'll reach out shortly.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
