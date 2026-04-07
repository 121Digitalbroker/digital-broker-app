"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Save, Upload, X, Check, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const citySectors: Record<string, string[]> = {
  'Noida': ['Sector 1', 'Sector 15', 'Sector 16', 'Sector 43', 'Sector 44', 'Sector 50', 'Sector 62', 'Sector 78', 'Sector 104', 'Sector 108', 'Sector 128', 'Sector 132', 'Sector 142', 'Sector 143', 'Sector 150', 'Sector 152', 'Sector 168'],
  'Greater Noida': ['Alpha I', 'Alpha II', 'Beta I', 'Beta II', 'Gamma I', 'Gamma II', 'Delta I', 'Omega I', 'Knowledge Park I', 'Knowledge Park II', 'Knowledge Park V', 'Tech Zone IV', 'Zeta I'],
  'Delhi': ['Dwarka', 'Rohini', 'Saket', 'Vasant Kunj', 'Janakpuri', 'Lajpat Nagar', 'Pitampura', 'Greater Kailash', 'Okhla', 'Connaught Place'],
  'Gurgaon': ['Sector 24', 'Sector 25', 'Sector 42', 'Sector 43', 'Sector 45', 'Sector 50', 'Sector 54', 'Sector 55', 'Sector 56', 'Sector 59', 'Sector 62', 'Sector 65', 'Sector 66']
};

export default function CreateProperty() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Section 1 — Developer Information
    developerName: '',
    developerLogo: '',

    // Section 2 — Project Information
    projectName: '',
    city: 'Noida',
    sector: '',
    projectSize: '',
    reraNumber: '',
    projectStatus: 'New Launch',

    // Section 3 — Property Type Selector
    propertyType: 'residential', // 'residential', 'commercial', 'both'

    // Section 4 — Residential Configurations
    residentialConfigs: [] as any[],

    // Section 5 — Commercial Configurations
    commercialConfigs: [] as any[],

    // Section 6 — Document Upload Section
    productImages: [''],
    brochureUrl: '',
    priceListUrl: '',
    sitePlanUrl: '',
    layoutPlanUrl: '',
    googleMapsUrl: '',

    // Section 7 — Additional Details
    aboutProject: '',
    amenities: [] as string[],

    // Internal Metadata/Settings
    isFeatured: false,
    isPromoted: false,
    showOnYamunaExpressway: false
  });

  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') router.push('/admin');
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(index !== undefined ? `${fieldName}-${index}` : fieldName);
    
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (data.success) {
        if (index !== undefined) {
          const newArray = [...(formData as any)[fieldName]];
          newArray[index] = data.url;
          setFormData({ ...formData, [fieldName]: newArray });
        } else {
          setFormData({ ...formData, [fieldName]: data.url });
        }
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

  const handleConfigUpload = async (e: React.ChangeEvent<HTMLInputElement>, configType: 'residential' | 'commercial', index: number, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(`${configType}-${index}-${fieldName}`);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (data.success) {
        if (configType === 'residential') {
          updateResidentialConfig(index, fieldName, data.url);
        } else {
          updateCommercialConfig(index, fieldName, data.url);
        }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.developerName || !formData.projectName) {
      alert("Developer Name and Project Name are required!");
      return;
    }
    setSaving(true);
    try {
      const cleanedResidential = formData.residentialConfigs.map(c => ({
        ...c,
        unitSize: Number(c.unitSize) || 0,
        pricePerSqft: Number(c.pricePerSqft) || 0,
        unfurnishedPriceSqft: Number(c.unfurnishedPriceSqft) || 0,
        semiFurnishedPriceSqft: Number(c.semiFurnishedPriceSqft) || 0,
        fullyFurnishedPriceSqft: Number(c.fullyFurnishedPriceSqft) || 0,
        plcPerSqft: Number(c.plcPerSqft) || 0,
        otherChargesPerSqft: Number(c.otherChargesPerSqft) || 0,
        customPricePerSqft: Number(c.customPricePerSqft) || 0,
        possessionDate: c.possessionDate ? new Date(c.possessionDate) : undefined
      }));

      const cleanedCommercial = formData.commercialConfigs.map(c => ({
        ...c,
        unitSize: Number(c.unitSize) || 0,
        pricePerSqft: Number(c.pricePerSqft) || 0,
      }));

      const payload = {
        ...formData,
        projectSize: formData.projectSize ? Number(formData.projectSize) : undefined,
        productImages: formData.productImages.filter(img => img.trim() !== ''),
        residentialConfigs: cleanedResidential,
        commercialConfigs: cleanedCommercial
      };

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      
      if (res.ok) {
        router.push('/admin');
      } else {
        alert(`Error saving property: ${result.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Error saving property: ${err.message}`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...formData.productImages];
    newImages[index] = value;
    setFormData({ ...formData, productImages: newImages });
  };

  const addResidentialConfig = () => {
    setFormData({
      ...formData,
      residentialConfigs: [
        ...formData.residentialConfigs,
        { 
          typology: '2BHK', 
          unitSize: 0, 
          pricePerSqft: 0, 
          unfurnishedPriceSqft: 0,
          semiFurnishedPriceSqft: 0,
          fullyFurnishedPriceSqft: 0,
          plcPerSqft: 0,
          otherChargesPerSqft: 0,
          customPricePerSqft: 0,
          priceRangeMin: 0, 
          priceRangeMax: 0, 
          plcCharges: 0, 
          otherCharges: 0, 
          possessionDate: '', 
          ticketSize: 0, 
          sitePlanUrl: '' 
        }
      ]
    });
  };

  const updateResidentialConfig = (index: number, field: string, value: any) => {
    const configs = [...formData.residentialConfigs];
    configs[index] = { ...configs[index], [field]: value };
    if (field === 'unitSize' || field === 'pricePerSqft') {
      const sqft = field === 'unitSize' ? Number(value) : Number(configs[index].unitSize || 0);
      const price = field === 'pricePerSqft' ? Number(value) : Number(configs[index].pricePerSqft || 0);
      configs[index].ticketSize = sqft * price;
    }
    setFormData({ ...formData, residentialConfigs: configs });
  };

  const removeResidentialConfig = (index: number) => {
    setFormData({
      ...formData,
      residentialConfigs: formData.residentialConfigs.filter((_, i) => i !== index)
    });
  };

  const addCommercialConfig = () => {
    setFormData({
      ...formData,
      commercialConfigs: [
        ...formData.commercialConfigs,
        { commercialType: 'Retail', unitSize: 0, pricePerSqft: 0, leaseYears: 0, assuredReturnPct: 0, preLeased: false, ticketSize: 0 }
      ]
    });
  };

  const updateCommercialConfig = (index: number, field: string, value: any) => {
    const configs = [...formData.commercialConfigs];
    configs[index] = { ...configs[index], [field]: value };
    if (field === 'unitSize' || field === 'pricePerSqft') {
      const sqft = field === 'unitSize' ? Number(value) : Number(configs[index].unitSize || 0);
      const price = field === 'pricePerSqft' ? Number(value) : Number(configs[index].pricePerSqft || 0);
      configs[index].ticketSize = sqft * price;
    }
    setFormData({ ...formData, commercialConfigs: configs });
  };

  const removeCommercialConfig = (index: number) => {
    setFormData({
      ...formData,
      commercialConfigs: formData.commercialConfigs.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-[#0a1628] font-sans pb-24">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12 pt-32">
        <Link href="/admin" className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-orange-500 mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-black text-[#0a1628]">New Project Listing</h1>
            <p className="text-gray-500 mt-2">Publish a comprehensive property project to the marketplace.</p>
          </div>
          <button 
             onClick={handleSubmit}
             disabled={saving}
             className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
          >
            {saving ? 'Publishing...' : <><Save className="w-5 h-5" /> Publish Project</>}
          </button>
        </div>

        <form className="space-y-8 animate-fade-in-up w-full max-w-6xl mx-auto">
          
          {/* SECTION 1: Developer Information */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
               <h3 className="text-xl font-black tracking-tight uppercase">1. Developer Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Developer Name <span className="text-red-500">*</span></label>
                 <input 
                   type="text" 
                   placeholder="e.g. DLF, Oberoi Realty" 
                   className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[#0a1628]"
                   value={formData.developerName}
                   onChange={(e) => setFormData({...formData, developerName: e.target.value})}
                   required
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Developer Logo</label>
                 <div className="flex gap-4">
                   <input 
                     type="text" 
                     placeholder="https://..." 
                     className="flex-1 bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[#0a1628]"
                     value={formData.developerLogo}
                     onChange={(e) => setFormData({...formData, developerLogo: e.target.value})}
                   />
                   <label className={`cursor-pointer px-6 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${uploadingField === 'developerLogo' ? 'bg-gray-200 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}>
                     <Upload className="w-4 h-4" />
                     {uploadingField === 'developerLogo' ? '...' : 'Upload'}
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'developerLogo')} />
                   </label>
                 </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Project Information */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
               <h3 className="text-xl font-black tracking-tight uppercase">2. Project Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Project Name <span className="text-red-500">*</span></label>
                 <input 
                   type="text" 
                   placeholder="e.g. DLF Camellias" 
                   className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-purple-500 transition-all font-medium text-[#0a1628]"
                   value={formData.projectName}
                   onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                   required
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">City</label>
                 <select 
                   className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-purple-500 transition-all font-bold text-[#0a1628]"
                   value={formData.city}
                   onChange={(e) => {
                     setFormData({...formData, city: e.target.value, sector: ''});
                   }}
                 >
                   <option value="Noida">Noida</option>
                   <option value="Greater Noida">Greater Noida</option>
                   <option value="Delhi">Delhi</option>
                   <option value="Gurgaon">Gurgaon</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Sector / Locality</label>
                 <select 
                   className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-purple-500 transition-all font-bold text-[#0a1628]"
                   value={formData.sector}
                   onChange={(e) => setFormData({...formData, sector: e.target.value})}
                 >
                   <option value="">Select Sector</option>
                   {citySectors[formData.city]?.map(sector => (
                     <option key={sector} value={sector}>{sector}</option>
                   ))}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Project Size (Acres)</label>
                 <input 
                   type="number" 
                   placeholder="e.g. 15" 
                   className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-purple-500 transition-all font-medium text-[#0a1628]"
                   value={formData.projectSize}
                   onChange={(e) => setFormData({...formData, projectSize: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">RERA Number</label>
                 <input 
                   type="text" 
                   className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-purple-500 transition-all font-medium text-[#0a1628]"
                   value={formData.reraNumber}
                   onChange={(e) => setFormData({...formData, reraNumber: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Project Status</label>
                 <select 
                   className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-purple-500 transition-all font-bold text-[#0a1628]"
                   value={formData.projectStatus}
                   onChange={(e) => setFormData({...formData, projectStatus: e.target.value})}
                 >
                   <option value="New Launch">New Launch</option>
                   <option value="Under Construction">Under Construction</option>
                   <option value="Ready To Move">Ready To Move</option>
                 </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: Property Type Selector */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                <h3 className="text-xl font-black tracking-tight uppercase">3. Project Modules</h3>
             </div>
             <p className="text-sm text-gray-500 mb-6">Select which configurations are available in this project.</p>
             <div className="flex bg-gray-50 p-2 rounded-[1.25rem] w-full md:w-fit border border-gray-100">
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, propertyType: 'residential'})}
                 className={`flex-1 md:px-10 py-3 rounded-xl font-black text-xs transition-all uppercase tracking-widest ${formData.propertyType === 'residential' ? 'bg-[#0a1628] text-white shadow-lg' : 'text-gray-400 hover:text-[#0a1628]'}`}
               >
                 Residential Only
               </button>
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, propertyType: 'commercial'})}
                 className={`flex-1 md:px-10 py-3 rounded-xl font-black text-xs transition-all uppercase tracking-widest ${formData.propertyType === 'commercial' ? 'bg-[#0a1628] text-white shadow-lg' : 'text-gray-400 hover:text-[#0a1628]'}`}
               >
                 Commercial Only
               </button>
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, propertyType: 'both'})}
                 className={`flex-1 md:px-10 py-3 rounded-xl font-black text-xs transition-all uppercase tracking-widest ${formData.propertyType === 'both' ? 'bg-[#0a1628] text-white shadow-lg' : 'text-gray-400 hover:text-[#0a1628]'}`}
               >
                 Both (Mixed Use)
               </button>
             </div>
          </div>

          {/* SECTION 4: Residential Configurations */}
          {(formData.propertyType === 'residential' || formData.propertyType === 'both') && (
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                   <h3 className="text-xl font-black tracking-tight uppercase">4. Residential Configurations</h3>
                </div>
                <button type="button" onClick={addResidentialConfig} className="flex items-center gap-2 text-green-600 font-bold hover:text-green-800 transition-colors">
                  <Plus className="w-5 h-5"/> Add Configuration
                </button>
              </div>

              <div className="space-y-6">
                {formData.residentialConfigs.map((config, index) => (
                  <div key={index} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 relative">
                    <button type="button" onClick={() => removeResidentialConfig(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <h4 className="font-bold uppercase text-sm text-gray-500 mb-4">Config #{index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Typology</label>
                        <select className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                                value={config.typology} onChange={(e) => updateResidentialConfig(index, 'typology', e.target.value)}>
                          <option value="2BHK">2BHK</option>
                          <option value="3BHK">3BHK</option>
                          <option value="4BHK">4BHK</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Unit Size (Sq.Ft)</label>
                        <input type="number" className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                               value={config.unitSize || ''} onChange={(e) => updateResidentialConfig(index, 'unitSize', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Price per Sq.Ft (₹)</label>
                        <input type="number" className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                               value={config.pricePerSqft || ''} onChange={(e) => updateResidentialConfig(index, 'pricePerSqft', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-green-600 uppercase">Ticket Size (Auto)</label>
                        <input type="text" readOnly className="w-full bg-green-50 border border-green-200 rounded-xl p-3 font-black text-green-700 pointer-events-none"
                               value={`₹ ${config.ticketSize?.toLocaleString() || 0}`} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Unfurnished Price/Sqft</label>
                        <input type="number" className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                               value={config.unfurnishedPriceSqft || ''} onChange={(e) => updateResidentialConfig(index, 'unfurnishedPriceSqft', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Semi-Furnished Price/Sqft</label>
                        <input type="number" className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                               value={config.semiFurnishedPriceSqft || ''} onChange={(e) => updateResidentialConfig(index, 'semiFurnishedPriceSqft', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Fully Furnished Price/Sqft</label>
                        <input type="number" className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                               value={config.fullyFurnishedPriceSqft || ''} onChange={(e) => updateResidentialConfig(index, 'fullyFurnishedPriceSqft', e.target.value)} />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">PLC per Sqft (₹)</label>
                        <input type="number" className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                               value={config.plcPerSqft || ''} onChange={(e) => updateResidentialConfig(index, 'plcPerSqft', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Other Charges per Sqft (₹)</label>
                        <input type="number" className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                               value={config.otherChargesPerSqft || ''} onChange={(e) => updateResidentialConfig(index, 'otherChargesPerSqft', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Custom Price per Sqft (₹)</label>
                        <input type="number" className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                               value={config.customPricePerSqft || ''} onChange={(e) => updateResidentialConfig(index, 'customPricePerSqft', e.target.value)} />
                      </div>

                      <div className="space-y-1 md:col-span-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Possession Date</label>
                        <input type="date" className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                               value={config.possessionDate ? new Date(config.possessionDate).toISOString().substring(0,10) : ''} 
                               onChange={(e) => updateResidentialConfig(index, 'possessionDate', e.target.value)} />
                      </div>
                      <div className="space-y-1 md:col-span-4 mt-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Configuration Site Plan (URL)</label>
                        <div className="flex gap-2">
                          <input type="text" className="flex-1 bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                                 placeholder="https://... (Image or PDF of layout plan)"
                                 value={config.sitePlanUrl || ''} 
                                 onChange={(e) => updateResidentialConfig(index, 'sitePlanUrl', e.target.value)} />
                          <label className={`cursor-pointer px-4 py-3 rounded-xl flex items-center justify-center transition-all ${uploadingField === `residential-${index}-sitePlanUrl` ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-700 hover:text-white'}`}>
                            {uploadingField === `residential-${index}-sitePlanUrl` ? (
                               <div className="w-5 h-5 border-2 border-gray-300 border-t-green-500 animate-spin rounded-full"></div>
                            ) : (
                               <Upload className="w-5 h-5" />
                            )}
                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleConfigUpload(e, 'residential', index, 'sitePlanUrl')} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: Commercial Configurations */}
          {(formData.propertyType === 'commercial' || formData.propertyType === 'both') && (
            <div className="bg-[#0a1628] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-white">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-[#0a1628] to-[#0a1628]"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-8 bg-yellow-400 rounded-full"></div>
                     <h3 className="text-xl font-black tracking-tight uppercase">5. Commercial Configurations</h3>
                  </div>
                  <button type="button" onClick={addCommercialConfig} className="flex items-center gap-2 text-yellow-400 font-bold hover:text-yellow-300 transition-colors">
                    <Plus className="w-5 h-5"/> Add Configuration
                  </button>
                </div>
                <div className="space-y-6">
                  {formData.commercialConfigs.map((config, index) => (
                    <div key={index} className="p-6 rounded-2xl border border-white/10 bg-white/5 relative">
                      <button type="button" onClick={() => removeCommercialConfig(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Property Type</label>
                          <select className="w-full bg-[#0a1628] border border-white/20 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 font-bold text-white font-medium"
                                  value={config.commercialType} onChange={(e) => updateCommercialConfig(index, 'commercialType', e.target.value)}>
                            <option value="Retail">Retail</option>
                            <option value="Studio">Studio</option>
                            <option value="Office">Office</option>
                            <option value="Food Court">Food Court</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Unit Size</label>
                          <input type="number" className="w-full bg-white/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 font-bold text-white" value={config.unitSize || ''} onChange={(e) => updateCommercialConfig(index, 'unitSize', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Price per Sqft</label>
                          <input type="number" className="w-full bg-white/5 border-none rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 font-bold text-white" value={config.pricePerSqft || ''} onChange={(e) => updateCommercialConfig(index, 'pricePerSqft', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-yellow-400 uppercase">Ticket Size</label>
                          <div className="w-full bg-yellow-400/10 rounded-xl p-3 font-black text-yellow-400">₹ {(config.ticketSize || 0).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: Document Upload Section */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
                <h3 className="text-xl font-black tracking-tight uppercase">6. Document Uploads</h3>
             </div>
             <div className="space-y-8">
                <div>
                   <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-[#0a1628]">Product Images</h4>
                      <button type="button" onClick={() => setFormData({...formData, productImages: [...formData.productImages, '']})} className="text-cyan-600 font-bold flex items-center gap-2 hover:text-cyan-700 text-sm">
                        <Plus className="w-4 h-4" /> Add Slot
                      </button>
                   </div>
                   <div className="space-y-3">
                      {formData.productImages.map((url, idx) => (
                        <div key={idx} className="flex gap-4">
                          <input type="text" placeholder="Image URL" value={url} onChange={(e) => handleImageUrlChange(idx, e.target.value)} className="flex-1 bg-gray-50 border-none rounded-xl p-4 font-medium" />
                          <label className={`cursor-pointer px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${uploadingField === `productImages-${idx}` ? 'bg-gray-200' : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white transition-all'}`}>
                            <Upload className="w-4 h-4" />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'productImages', idx)} />
                          </label>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Brochure PDF</label>
                       <div className="flex gap-3">
                         <input type="text" className="flex-1 bg-gray-50 border-none rounded-2xl p-5" value={formData.brochureUrl} onChange={(e) => setFormData({...formData, brochureUrl: e.target.value})} />
                         <label className="cursor-pointer px-5 py-5 bg-cyan-100 text-cyan-700 rounded-2xl hover:bg-cyan-700 hover:text-white transition-all">
                           <Upload className="w-5 h-5" />
                           <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'brochureUrl')} />
                         </label>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price List</label>
                       <div className="flex gap-3">
                         <input type="text" className="flex-1 bg-gray-50 border-none rounded-2xl p-5" value={formData.priceListUrl} onChange={(e) => setFormData({...formData, priceListUrl: e.target.value})} />
                         <label className="cursor-pointer px-5 py-5 bg-cyan-100 text-cyan-700 rounded-2xl hover:bg-cyan-700 hover:text-white transition-all">
                           <Upload className="w-5 h-5" />
                           <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'priceListUrl')} />
                         </label>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Site Plan</label>
                       <div className="flex gap-3">
                         <input type="text" className="flex-1 bg-gray-50 border-none rounded-2xl p-5" value={formData.sitePlanUrl} onChange={(e) => setFormData({...formData, sitePlanUrl: e.target.value})} />
                         <label className="cursor-pointer px-5 py-5 bg-cyan-100 text-cyan-700 rounded-2xl hover:bg-cyan-700 hover:text-white transition-all">
                           <Upload className="w-5 h-5" />
                           <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'sitePlanUrl')} />
                         </label>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Layout Plan</label>
                       <div className="flex gap-3">
                         <input type="text" className="flex-1 bg-gray-50 border-none rounded-2xl p-5" value={formData.layoutPlanUrl} onChange={(e) => setFormData({...formData, layoutPlanUrl: e.target.value})} />
                         <label className="cursor-pointer px-5 py-5 bg-cyan-100 text-cyan-700 rounded-2xl hover:bg-cyan-700 hover:text-white transition-all">
                           <Upload className="w-5 h-5" />
                           <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'layoutPlanUrl')} />
                         </label>
                       </div>
                    </div>
                </div>
             </div>
          </div>

          {/* SECTION 7: Description & Maps */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                <h3 className="text-xl font-black tracking-tight uppercase">7. Description & Location</h3>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest">About the Project</label>
                   <textarea rows={5} placeholder="Describe the project..." className="w-full bg-gray-50 border-none rounded-2xl p-5" value={formData.aboutProject} onChange={(e) => setFormData({...formData, aboutProject: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Google Maps URL</label>
                   <input type="text" placeholder="URL" className="w-full bg-gray-50 border-none rounded-2xl p-5" value={formData.googleMapsUrl} onChange={(e) => setFormData({...formData, googleMapsUrl: e.target.value})} />
                </div>
             </div>
          </div>

          {/* SECTION 8: Amenities & Promotion */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm border-t-8 border-t-orange-500">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                <h3 className="text-xl font-black tracking-tight uppercase">8. Promotion & Amenities</h3>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div>
                  <h4 className="text-sm font-black text-[#0a1628] uppercase tracking-widest mb-6">Key Amenities</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {['Swimming Pool', 'Gymnasium', 'Clubhouse', 'Childrens Play Area', 'Covered Parking', '24/7 Security', 'Power Backup', 'Landscaped Gardens'].map((amenity) => (
                      <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500" checked={formData.amenities.includes(amenity)} onChange={(e) => {
                            const newAmenities = e.target.checked ? [...formData.amenities, amenity] : formData.amenities.filter(a => a !== amenity);
                            setFormData({...formData, amenities: newAmenities});
                          }} />
                        <span className="text-sm font-bold text-gray-600 group-hover:text-[#0a1628]">{amenity}</span>
                      </label>
                    ))}
                  </div>
               </div>

               <div className="bg-gray-50 rounded-3xl p-8 space-y-8">
                  <div className="space-y-6">
                    <label className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0a1628]">Promoted Selection</span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Show in top homepage</span>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={formData.isPromoted} onChange={(e) => setFormData({...formData, isPromoted: e.target.checked})} />
                        <div className={`w-14 h-8 rounded-full transition-all ${formData.isPromoted ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                        <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isPromoted ? 'translate-x-6' : ''}`}></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0a1628]">Featured Project</span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Mark as premium</span>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} />
                        <div className={`w-14 h-8 rounded-full transition-all ${formData.isFeatured ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                        <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isFeatured ? 'translate-x-6' : ''}`}></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0a1628]">Show on Yamuna Expressway</span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Display on Yamuna Expressway page</span>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={formData.showOnYamunaExpressway} onChange={(e) => setFormData({...formData, showOnYamunaExpressway: e.target.checked})} />
                        <div className={`w-14 h-8 rounded-full transition-all ${formData.showOnYamunaExpressway ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.showOnYamunaExpressway ? 'translate-x-6' : ''}`}></div>
                      </div>
                    </label>
                  </div>
               </div>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}
