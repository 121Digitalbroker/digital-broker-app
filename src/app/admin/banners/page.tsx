"use client";
import React, { useState, useEffect } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { ArrowLeft, Plus, Trash2, Upload, Save, X, ImageIcon, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminBanners() {
  const router = useRouter();
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingField, setUploadingField] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') router.push('/admin');
    else fetchBanners();
  }, [router]);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/yamuna-banners');
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error('Error fetching banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(index);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        const newBanners = [...banners];
        newBanners[index].image = data.url;
        setBanners(newBanners);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Upload error!");
    } finally {
      setUploadingField(null);
    }
  };

  const addBanner = () => {
    setBanners([...banners, { image: '', title: '', order: banners.length, isActive: true }]);
  };

  const removeBanner = async (id: string, index: number) => {
    if (!confirm('Are you sure you want to remove this slide?')) return;
    
    if (!id) {
       setBanners(banners.filter((_, i) => i !== index));
       return;
    }

    try {
      const res = await fetch(`/api/yamuna-banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners(banners.filter((_, i) => i !== index));
      } else {
        alert('Failed to delete banner');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateBanner = (index: number, field: string, value: any) => {
    const newBanners = [...banners];
    newBanners[index] = { ...newBanners[index], [field]: value };
    setBanners(newBanners);
  };

  const handleSave = async (banner: any, index: number) => {
    if (!banner.image || !banner.title) {
        alert("Image and Title are required!");
        return;
    }
    
    setSaving(true);
    try {
      const method = banner._id ? 'PATCH' : 'POST';
      const url = banner._id ? `/api/yamuna-banners/${banner._id}` : '/api/yamuna-banners';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner)
      });
      
      if (res.ok) {
        const savedBanner = await res.json();
        const newBanners = [...banners];
        newBanners[index] = savedBanner;
        setBanners(newBanners);
        alert('Banner saved successfully!');
      } else {
        alert('Error saving banner');
      }
    } catch (err) {
      console.error(err);
      alert('Save error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#0a1628] border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-[#0a1628] font-sans pb-24 text-left">
      <AdminNavbar />
      
      <div className="container mx-auto px-6 md:px-12 pt-16">
        <Link href="/admin" className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-orange-500 mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to CMS
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <ImageIcon className="w-10 h-10 text-orange-500" /> Hero Banners
            </h1>
            <p className="text-gray-500 mt-2">Manage your homepage hero slider slides.</p>
          </div>
          <button 
            onClick={addBanner}
            className="bg-[#0a1628] hover:bg-[#1a2d4a] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-blue-900/10"
          >
            <Plus className="w-5 h-5" /> Add New Slide
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {banners.map((banner, index) => (
             <div key={banner._id || `new-${index}`} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group">
               <div className="relative h-64 bg-gray-900 overflow-hidden">
                 {banner.image ? (
                   <img src={banner.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-3 bg-gray-50">
                     <ImageIcon className="w-12 h-12 opacity-20" />
                     <p className="font-bold text-xs uppercase tracking-widest opacity-40">No Image Selected</p>
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                 
                 <label className={`absolute bottom-6 right-6 p-4 rounded-2xl cursor-pointer transition-all shadow-xl flex items-center gap-2 ${uploadingField === index ? 'bg-gray-100 text-gray-400' : 'bg-white text-[#0a1628] hover:bg-orange-500 hover:text-white'}`}>
                   {uploadingField === index ? (
                     <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-500 animate-spin rounded-full"></div>
                   ) : (
                     <>
                       <Upload className="w-5 h-5" />
                       <span className="font-bold text-xs uppercase tracking-tight">Upload</span>
                     </>
                   )}
                   <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, index)} />
                 </label>
               </div>

               <div className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Slide Title / Headline</label>
                    <input 
                      type="text" 
                      placeholder="e.g. India's Biggest Airport"
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                      value={banner.title}
                      onChange={(e) => updateBanner(index, 'title', e.target.value)}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 text-left">Display Order</label>
                       <input 
                         type="number" 
                         className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold"
                         value={banner.order}
                         onChange={(e) => updateBanner(index, 'order', parseInt(e.target.value))}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Status</label>
                       <button 
                         onClick={() => updateBanner(index, 'isActive', !banner.isActive)}
                         className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${banner.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                       >
                         {banner.isActive ? <><Check className="w-4 h-4" /> Active</> : <><X className="w-4 h-4" /> Hidden</>}
                       </button>
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4 border-t border-gray-50">
                    <button 
                      onClick={() => handleSave(banner, index)}
                      disabled={saving}
                      className="flex-1 bg-[#0a1628] hover:bg-orange-600 text-white p-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" /> Save Slide
                    </button>
                    <button 
                      onClick={() => removeBanner(banner._id, index)}
                      className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                 </div>
               </div>
             </div>
           ))}
        </div>

        {banners.length === 0 && (
          <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 italic text-gray-400">
             No hero slides found. Click "Add New Slide" to begin.
          </div>
        )}
      </div>
    </div>
  );
}
