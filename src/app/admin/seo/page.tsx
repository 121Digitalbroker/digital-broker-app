"use client";
import React, { useState, useEffect } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { Shield, Globe, Search, Save, Loader2, CheckCircle, Info, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function AdminSEOPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    siteTitle: '',
    siteDescription: '',
    keywords: '',
    googleVerification: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data) {
        setFormData({
          siteTitle: data.siteTitle || '',
          siteDescription: data.siteDescription || '',
          keywords: data.keywords || '',
          googleVerification: data.googleVerification || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'SEO settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update settings.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#0a1628] font-sans">
      <AdminNavbar />

      <div className="container mx-auto px-6 md:px-12 pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500">
                  <Globe className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-black tracking-tight uppercase">SEO & Metadata</h1>
              </div>
              <p className="text-gray-500 pl-1">Optimize how your website appears on Google and social media.</p>
            </div>
            <Link 
              href="/admin"
              className="px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all flex items-center gap-2 text-sm"
            >
              <LayoutDashboard className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>

          {message && (
            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p className="font-bold text-sm tracking-wide">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Main SEO Section */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  {/* Site Title */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Site Title</label>
                      <span className="text-[10px] font-bold text-orange-500">{formData.siteTitle.length}/60 chars recommended</span>
                    </div>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-orange-500 transition-all font-bold text-[#0a1628] text-lg"
                      placeholder="e.g. Digital Broker | Premium Real Estate Noida"
                      value={formData.siteTitle}
                      onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                      required
                    />
                  </div>

                  {/* Site Description */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Meta Description</label>
                      <span className="text-[10px] font-bold text-orange-500">{formData.siteDescription.length}/160 chars recommended</span>
                    </div>
                    <textarea
                      rows={4}
                      className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-orange-500 transition-all font-medium text-[#0a1628] leading-relaxed"
                      placeholder="Enter a brief summary of your website for search results..."
                      value={formData.siteDescription}
                      onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                      required
                    />
                  </div>

                  {/* Keywords */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <Search className="w-3.5 h-3.5 text-gray-400" />
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Search Keywords (CSV)</label>
                    </div>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-orange-500 transition-all font-bold text-[#0a1628]"
                      placeholder="e.g. real estate, noida properties, yamuna expressway plots"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    />
                    <p className="text-[10px] text-gray-400 font-medium pl-1 italic">* Separate each keyword with a comma</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Section */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="flex items-center gap-3 mb-8">
                <Shield className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-black tracking-tight uppercase">Search Verification</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Google Console ID</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-green-500 transition-all font-mono font-medium text-[#0a1628]"
                    placeholder="e.g. google5ea580b37fc40bfa"
                    value={formData.googleVerification}
                    onChange={(e) => setFormData({ ...formData, googleVerification: e.target.value })}
                  />
                  <div className="flex items-start gap-2 mt-2 px-1">
                    <Info className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-gray-400 font-medium">This is the verification code from Google Search Console settings.</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-xs text-gray-400">
                    <p>Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full md:w-auto px-12 py-4 bg-[#0a1628] hover:bg-orange-500 text-white rounded-[1.25rem] font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#0a1628]/10 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> Save SEO Settings
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Tips Card */}
          <div className="mt-10 p-6 bg-orange-50 rounded-3xl border border-orange-100">
            <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 fill-orange-500" /> SEO Best Practices
            </h4>
            <ul className="text-xs text-orange-700/80 space-y-2 list-disc list-inside px-1">
              <li>Keep titles under 60 characters for best appearance on Google.</li>
              <li>Descriptions should be between 140-160 characters.</li>
              <li>Include your primary location (e.g. "Yamuna Expressway") in both title and description.</li>
              <li>Wait 24-48 hours for Google to re-crawl your site and update the "Search Bar" preview.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
