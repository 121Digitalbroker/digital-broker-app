"use client";
import React, { useState, useEffect } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { Plus, Edit, Trash2, LayoutDashboard, Database, TrendingUp, Users, ExternalLink, Star, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'leads'
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthorized(true);
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const promises = [
        fetch('/api/properties?adminAccess=true').then(r => r.json()),
        fetch('/api/leads').then(r => r.json()),

      ];

      const results = await Promise.all(promises);
      setProperties(results[0]);
      setLeads(results[1]);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_role', data.role);
        setIsAuthorized(true);
        fetchAllData();
      } else {
        alert(data.error || 'Invalid Credentials');
      }
    } catch (err) {
      alert('Login error');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePromotion = async (id: string, currentValue: boolean, field: 'isPromoted' | 'isFeatured') => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentValue })
      });
      if (res.ok) {
        // Optimistically update local state
        setProperties((prev: any[]) =>
          prev.map((p: any) => p._id === id ? { ...p, [field]: !currentValue } : p)
        );
      } else {
        alert('Failed to update property');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !currentValue })
      });
      if (res.ok) {
        setProperties((prev: any[]) =>
          prev.map((p: any) => p._id === id ? { ...p, isVisible: !currentValue } : p)
        );
      } else {
        alert('Failed to update visibility');
      }
    } catch (err) {
      console.error(err);
    }
  };





  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6 text-left">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Admin Access</h1>
            <p className="text-blue-200 text-center mb-8 text-sm">Sign in to workspace</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username (e.g. superadmin)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-blue-300 focus:outline-none focus:border-orange-500 transition-all font-medium"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-blue-300 focus:outline-none focus:border-orange-500 transition-all font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/20 mt-2">
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#0a1628] font-sans text-left">
      <AdminNavbar />

      <div className="container mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <LayoutDashboard className="w-10 h-10 text-orange-500" /> CMS Console
            </h1>
            <p className="text-gray-500 mt-2 text-left">Control center for Digital Broker operations.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === 'properties' ? 'bg-[#0a1628] text-white' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === 'leads' ? 'bg-[#0a1628] text-white' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
            >
              Leads ({leads.length})
            </button>
            <Link
              href="/admin/banners"
              className="px-8 py-3 rounded-2xl font-bold bg-white text-gray-400 hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" /> Banners
            </Link>

          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0a1628]">
              <Database className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-left">Assets</p>
              <p className="text-3xl font-black text-left">{properties.length}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6 text-left">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-left">Total Leads</p>
              <p className="text-3xl font-black text-left">{leads.length}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6 text-left">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <TrendingUp className="w-7 h-7 text-left" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-left">Active ROI</p>
              <p className="text-3xl font-black text-left">8.4%</p>
            </div>
          </div>
        </div>

        {activeTab === 'properties' ? (
          /* Listings Table */
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-left">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-[#0a1628]">Property Listings</h3>
              <Link
                href="/admin/create"
                className="bg-[#0a1628] hover:bg-[#1a2d4a] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" /> Add Property
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                    <th className="px-8 py-5">Property</th>
                    <th className="px-8 py-5">Price</th>
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-center">⭐ Promote</th>
                    <th className="px-8 py-5 text-center">👁️ Visible</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-left">
                  {properties.map((p: any) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={p.productImages?.[0] || p.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop'} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-[#0a1628]">{p.projectName || p.title || 'Untitled Project'}</div>
                            <div className="text-xs text-gray-400">{p.sector ? `${p.sector}, ` : ''}{p.city || p.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold">
                        {p.propertyType === 'commercial'
                          ? (p.commercialConfigs?.[0]?.ticketSize ? `₹ ${Math.round(p.commercialConfigs[0].ticketSize / 100000)}L+` : p.price)
                          : (p.propertyType === 'residential' || p.propertyType === 'both')
                            ? (p.residentialConfigs?.[0]?.ticketSize ? `₹ ${Math.round(p.residentialConfigs[0].ticketSize / 10000000)}Cr+` : p.price)
                            : p.price
                        }
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {p.propertyType || p.type}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          {p.projectStatus && (
                            <span className="bg-green-50 text-green-600 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider w-fit">
                              {p.projectStatus}
                            </span>
                          )}
                          {p.isFeatured && (
                            <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider w-fit">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Promote Toggle */}
                      <td className="px-8 py-6 text-center">
                        <button
                          onClick={() => handleTogglePromotion(p._id, !!p.isPromoted, 'isPromoted')}
                          title={p.isPromoted ? 'Remove from Promoted' : 'Add to Promoted'}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center mx-auto transition-all ${p.isPromoted
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-orange-50 hover:text-orange-400'
                            }`}
                        >
                          <Star className={`w-5 h-5 ${p.isPromoted ? 'fill-white' : ''}`} />
                        </button>
                      </td>
                      {/* Visibility Toggle */}
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleToggleVisibility(p._id, p.isVisible !== false)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${p.isVisible !== false ? 'bg-indigo-500' : 'bg-gray-200'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${p.isVisible !== false ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 text-left">
                          <Link href={`/properties/${p._id}`} target="_blank" className="p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-gray-100 text-gray-400 hover:text-blue-500">
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                          <Link href={`/admin/edit/${p._id}`} className="p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-gray-100 text-gray-400 hover:text-orange-500">
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProperty(p._id)}
                            className="p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-gray-100 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'leads' ? (
          /* Leads Table */
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-left">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-[#0a1628]">Customer Inquiries</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 text-left">
                    <th className="px-8 py-5">Customer</th>
                    <th className="px-8 py-5">Email & Phone</th>
                    <th className="px-8 py-5">Source Property</th>
                    <th className="px-8 py-5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-left">
                  {leads.map((l: any) => (
                    <tr key={l._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold">{l.name}</td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-medium">{l.email}</div>
                        {l.phone && <div className="text-xs text-gray-400">{l.phone}</div>}
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-gray-50 text-[#0a1628] px-4 py-1.5 rounded-xl text-xs font-bold border border-gray-100">
                          {l.propertyTitle || 'General Inquiry'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-gray-400 text-xs">
                        {new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
