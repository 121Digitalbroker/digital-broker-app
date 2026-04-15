"use client";
import React, { useState, useEffect } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { ArrowLeft, Save, Upload, X, Check, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const citySectors: Record<string, string[]> = {
  'Noida': ['Sector 1', 'Sector 15', 'Sector 16', 'Sector 43', 'Sector 44', 'Sector 50', 'Sector 62', 'Sector 78', 'Sector 104', 'Sector 108', 'Sector 128', 'Sector 132', 'Sector 142', 'Sector 143', 'Sector 150', 'Sector 152', 'Sector 168'],
  'Greater Noida': ['Alpha I', 'Alpha II', 'Beta I', 'Beta II', 'Gamma I', 'Gamma II', 'Delta I', 'Omega I', 'Knowledge Park I', 'Knowledge Park II', 'Knowledge Park V', 'Tech Zone IV', 'Zeta I'],
  'Noida Extension': ['Tech Zone IV', 'Gaur City', 'Sector 16C', 'Sector 16D', 'Sector 10', 'Sector 12', 'Sector 1'],
  'Yamuna Expressway': ['Sector 22 A', 'Sector 22 D', 'Sector 22 C', 'Sector 18', 'Sector 20', 'Sector 19 A']
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
    morePhotos: [] as string[],
    brochureUrl: '',
    priceListUrl: '',
    sitePlanUrl: '',
    googleMapsUrl: '',

    // Section 7 — Additional Details
    aboutProject: '',
    amenities: [] as string[],

    // Internal Metadata/Settings
    isFeatured: false,
    isPromoted: false,
    showOnYamunaExpressway: false,
    isVisible: true,

    // Loanable option - Project level
    loanable: 'NO',

    // Nearby Locations
    nearbyLocations: [] as { name: string; distance: string }[]
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
        plcElements: (c.plcElements || []).map((p: any) => ({ name: p.name, price: Number(p.price) || 0 })),
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
        morePhotos: formData.morePhotos.filter((img: string) => img.trim() !== ''),
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
          plcElements: [],
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
        { commercialType: 'Retail', unitSize: 0, pricePerSqft: 0, leaseYears: 0, assuredReturnPct: 0, preLeased: false, isLockable: true, ticketSize: 0 }
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
      <AdminNavbar />

      <div className="container mx-auto px-6 md:px-12 pt-32">
        <Link href="/admin" className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-orange-500 mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-black text-[#0a1628]">New Project Listing</h1>
            <p className="text-gray-500 mt-2">Publish a comprehensive property project to the marketplace.</p>
          </div>
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
                  onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Developer Logo</label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1 flex gap-4">
                    <input
                      type="text"
                      placeholder="https://..."
                      className="flex-1 bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[#0a1628]"
                      value={formData.developerLogo}
                      onChange={(e) => setFormData({ ...formData, developerLogo: e.target.value })}
                    />
                    <label className={`cursor-pointer px-6 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${uploadingField === 'developerLogo' ? 'bg-gray-200 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}>
                      <Upload className="w-4 h-4" />
                      {uploadingField === 'developerLogo' ? '...' : 'Upload'}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'developerLogo')} />
                    </label>
                  </div>
                  {formData.developerLogo && (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 bg-white flex items-center justify-center p-1 shrink-0">
                      <img src={formData.developerLogo} alt="Logo" className="w-full h-full object-contain rounded-full" />
                    </div>
                  )}
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
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Location Name</label>
                <select
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-purple-500 transition-all font-bold text-[#0a1628]"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value, sector: '' });
                  }}
                >
                  <option value="Noida">Noida</option>
                  <option value="Greater Noida">Greater Noida</option>
                  <option value="Noida Extension">Noida Extension</option>
                  <option value="Yamuna Expressway">Yamuna Expressway</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Sector / Locality</label>
                <select
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-purple-500 transition-all font-bold text-[#0a1628]"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, projectSize: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">RERA Number</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-purple-500 transition-all font-medium text-[#0a1628]"
                  value={formData.reraNumber}
                  onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Project Status</label>
                <select
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-purple-500 transition-all font-bold text-[#0a1628]"
                  value={formData.projectStatus}
                  onChange={(e) => setFormData({ ...formData, projectStatus: e.target.value })}
                >
                  <option value="Pre Launch">Pre Launch</option>
                  <option value="New Launch">New Launch</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Ready To Move">Ready To Move</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Loanable Option</label>
                <select
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-purple-500 transition-all font-bold text-[#0a1628]"
                  value={formData.loanable || 'NO'}
                  onChange={(e) => setFormData({ ...formData, loanable: e.target.value })}
                >
                  <option value="NO">No</option>
                  <option value="YES">Yes</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="SELECTIVE BANKS ONLY">Selective Banks Only</option>
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
                onClick={() => setFormData({ ...formData, propertyType: 'residential' })}
                className={`flex-1 md:px-10 py-3 rounded-xl font-black text-xs transition-all uppercase tracking-widest ${formData.propertyType === 'residential' ? 'bg-[#0a1628] text-white shadow-lg' : 'text-gray-400 hover:text-[#0a1628]'}`}
              >
                Residential Only
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, propertyType: 'commercial' })}
                className={`flex-1 md:px-10 py-3 rounded-xl font-black text-xs transition-all uppercase tracking-widest ${formData.propertyType === 'commercial' ? 'bg-[#0a1628] text-white shadow-lg' : 'text-gray-400 hover:text-[#0a1628]'}`}
              >
                Commercial Only
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, propertyType: 'both' })}
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
                  <Plus className="w-5 h-5" /> Add Configuration
                </button>
              </div>

              <div className="space-y-6">
                {formData.residentialConfigs.map((config, index) => (
                  <div key={index} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 relative">
                    <button type="button" onClick={() => removeResidentialConfig(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <h4 className="font-bold uppercase text-sm text-gray-500 mb-4">Config #{index + 1}</h4>

                    {/* ROW 1: Typology & Furnishing */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                        <label className="text-[10px] font-black text-gray-400 uppercase">Furnishing Type</label>
                        <select className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                          value={config.furnishingType || ''} onChange={(e) => updateResidentialConfig(index, 'furnishingType', e.target.value)}>
                          <option value="">Select Type</option>
                          <option value="Bare Shell">Bare Shell</option>
                          <option value="Unfurnished">Unfurnished</option>
                          <option value="Semi Furnished">Semi Furnished</option>
                          <option value="Fully Furnished">Fully Furnished</option>
                        </select>
                      </div>
                    </div>

                    {/* ROW 2: Unit Features */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Servant Room / Study</label>
                        <select className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                          value={config.servantRooms || ''} onChange={(e) => updateResidentialConfig(index, 'servantRooms', e.target.value)}>
                          <option value="">Select</option>
                          {[1, 2, 3, 4].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Toilets</label>
                        <select className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                          value={config.toilets || ''} onChange={(e) => updateResidentialConfig(index, 'toilets', e.target.value)}>
                          <option value="">Select</option>
                          {[1, 2, 3, 4, 5, 6].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Balconies</label>
                        <select className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                          value={config.balconies || ''} onChange={(e) => updateResidentialConfig(index, 'balconies', e.target.value)}>
                          <option value="">Select</option>
                          {[1, 2, 3, 4, 5, 6].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Terraces</label>
                        <select className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                          value={config.terraces || ''} onChange={(e) => updateResidentialConfig(index, 'terraces', e.target.value)}>
                          <option value="">Select</option>
                          {[1, 2, 3, 4].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Store Room</label>
                        <select className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                          value={config.storeRoom || ''} onChange={(e) => updateResidentialConfig(index, 'storeRoom', e.target.value)}>
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Car Parking</label>
                        <select className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                          value={config.carParking || ''} onChange={(e) => updateResidentialConfig(index, 'carParking', e.target.value)}>
                          <option value="">Select</option>
                          <option value="Included">Included</option>
                          <option value="Not Included">Not Included</option>
                        </select>
                      </div>
                      {config.carParking === 'Included' && (
                        <div className="space-y-1 animate-fade-in">
                          <label className="text-[10px] font-black text-green-600 uppercase">Parking Price (₹)</label>
                          <input type="number" className="w-full bg-white border border-green-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                            placeholder="Enter parking price"
                            value={config.parkingPrice || ''} onChange={(e) => updateResidentialConfig(index, 'parkingPrice', e.target.value)} />
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Club Membership</label>
                        <select className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                          value={config.clubMembership || ''} onChange={(e) => updateResidentialConfig(index, 'clubMembership', e.target.value)}>
                          <option value="">Select</option>
                          <option value="Included">Included</option>
                          <option value="Not Included">Not Included</option>
                          <option value="Optional">Optional</option>
                        </select>
                      </div>
                      {config.clubMembership === 'Included' && (
                        <div className="space-y-1 animate-fade-in">
                          <label className="text-[10px] font-black text-green-600 uppercase">Membership Price (₹)</label>
                          <input type="number" className="w-full bg-white border border-green-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                            placeholder="Enter membership price"
                            value={config.clubMembershipPrice || ''} onChange={(e) => updateResidentialConfig(index, 'clubMembershipPrice', e.target.value)} />
                        </div>
                      )}
                    </div>

                    {/* ROW 3: Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                    </div>

                    {/* ROW 4: Additional Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="space-y-2 md:col-span-4 bg-white border border-gray-200 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase">PLC Elements</label>
                          <button type="button" onClick={() => {
                            const newPlcs = [...(config.plcElements || [])];
                            newPlcs.push({ name: '', price: '' });
                            updateResidentialConfig(index, 'plcElements', newPlcs);
                          }} className="text-[10px] font-bold text-green-600 hover:text-green-800 flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Add PLC
                          </button>
                        </div>
                        {(config.plcElements || []).length === 0 ? (
                          <p className="text-xs text-gray-400 italic mb-2">No PLC added. Click 'Add PLC' to include preferential location charges.</p>
                        ) : (
                          <div className="space-y-2">
                            {(config.plcElements || []).map((plc: any, plcIdx: number) => (
                              <div key={plcIdx} className="flex gap-2 items-center">
                                <input type="text" placeholder="PLC Name (e.g. Park Facing)" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-green-500" value={plc.name} onChange={(e) => {
                                  const newPlcs = [...config.plcElements];
                                  newPlcs[plcIdx].name = e.target.value;
                                  updateResidentialConfig(index, 'plcElements', newPlcs);
                                }} />
                                <input type="number" placeholder="Price (₹)" className="w-32 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-green-500" value={plc.price} onChange={(e) => {
                                  const newPlcs = [...config.plcElements];
                                  newPlcs[plcIdx].price = e.target.value;
                                  updateResidentialConfig(index, 'plcElements', newPlcs);
                                }} />
                                <button type="button" onClick={() => {
                                  const newPlcs = config.plcElements.filter((_: any, i: number) => i !== plcIdx);
                                  updateResidentialConfig(index, 'plcElements', newPlcs);
                                }} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Other Charges per Sqft (₹)</label>
                        <input type="number" className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                          value={config.otherChargesPerSqft || ''} onChange={(e) => updateResidentialConfig(index, 'otherChargesPerSqft', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Possession Month</label>
                        <select className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                          value={config.possessionMonth || ''} onChange={(e) => updateResidentialConfig(index, 'possessionMonth', e.target.value)}>
                          <option value="">Select Month</option>
                          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Possession Year</label>
                        <select className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                          value={config.possessionYear || ''} onChange={(e) => updateResidentialConfig(index, 'possessionYear', e.target.value)}>
                          <option value="">Select Year</option>
                          {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black text-green-600 uppercase">RERA Link (Auto-fetch)</label>
                        <input type="url" placeholder="https://rera.gov.in/..." className="w-full bg-green-50 border border-green-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 font-bold"
                          value={config.reraLink || ''} onChange={(e) => updateResidentialConfig(index, 'reraLink', e.target.value)} />
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
                    <Plus className="w-5 h-5" /> Add Configuration
                  </button>
                </div>
                <div className="space-y-6">
                  {formData.commercialConfigs.map((config, index) => (
                    <div key={index} className="p-8 rounded-[2rem] border border-white/10 bg-white/5 relative">
                      <button type="button" onClick={() => removeCommercialConfig(index)} className="absolute top-6 right-6 text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="space-y-8">
                        {/* ROW 1: BASIC INFO */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Property Type</label>
                            <select className="w-full bg-[#0a1628] border border-white/20 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 font-bold text-white"
                              value={config.commercialType} onChange={(e) => updateCommercialConfig(index, 'commercialType', e.target.value)}>
                              <option value="Office Spaces">Office Spaces</option>
                              <option value="Business Suite">Business Suite</option>
                              <option value="Gaming Zone">Gaming Zone</option>
                              <option value="Fine Dining">Fine Dining</option>
                              <option value="Serviced Apartment">Serviced Apartment</option>
                              <option value="Retail">Retail</option>
                              <option value="Food Court">Food Court</option>
                              <option value="Industrial">Industrial</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Unit Size (Sq.Ft)</label>
                            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 font-bold text-white" value={config.unitSize || ''} onChange={(e) => updateCommercialConfig(index, 'unitSize', e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Price per Sqft (₹)</label>
                            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 font-bold text-white" value={config.pricePerSqft || ''} onChange={(e) => updateCommercialConfig(index, 'pricePerSqft', e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-yellow-400 uppercase tracking-widest pl-1">Ticket Size (Auto)</label>
                            <div className="w-full bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3 font-black text-yellow-400">₹ {(config.ticketSize || 0).toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="h-px bg-white/5 w-full"></div>

                        {/* ROW 2: LOCKABLE / UNLOCKABLE */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Lockable / Unlockable</label>
                            <select className="w-full bg-[#0a1628] border border-white/20 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 font-bold text-white"
                              value={config.isLockable ? 'Lockable' : 'Unlockable'} onChange={(e) => updateCommercialConfig(index, 'isLockable', e.target.value === 'Lockable')}>
                              <option value="Lockable">Lockable</option>
                              <option value="Unlockable">Unlockable</option>
                            </select>
                          </div>
                        </div>

                        {/* ROW 3: PRE LEASED */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Pre Leased Status</label>
                          <label className="flex items-center gap-4 bg-white/5 w-fit p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all group">
                            <input type="checkbox" className="w-6 h-6 rounded border-white/20 text-yellow-400 focus:ring-yellow-400 transition-all" checked={config.preLeased} onChange={(e) => updateCommercialConfig(index, 'preLeased', e.target.checked)} />
                            <span className="text-sm font-bold text-white group-hover:text-yellow-400">Yes, This property is already leased</span>
                          </label>
                        </div>

                        {/* ROW 4: MLG RATE | ASSURED PROFIT */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">MLG Rate (130-140/sqft)</label>
                            <input type="number" placeholder="Rate per sqft" disabled={!config.preLeased} className={`w-full border border-white/10 rounded-xl p-3 font-bold text-white transition-all ${config.preLeased ? 'bg-white/5 focus:ring-2 focus:ring-yellow-400' : 'bg-white/10 text-white/50 cursor-not-allowed'}`} value={config.mlgRatePerSqft || ''} onChange={(e) => updateCommercialConfig(index, 'mlgRatePerSqft', e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-yellow-400 uppercase tracking-widest pl-1">Assured Profit (MLG × SIZE)</label>
                            <div className="w-full bg-yellow-400/5 border border-yellow-400/30 rounded-xl p-3 font-black text-yellow-400 h-[48px] flex items-center px-4">
                              {config.preLeased && config.mlgRatePerSqft > 0 ? (
                                <span className="flex items-center gap-2">
                                  <span className="text-xs font-medium opacity-50">₹{config.mlgRatePerSqft} × {config.unitSize} =</span>
                                  <span>₹ {(config.mlgRatePerSqft * config.unitSize).toLocaleString()} / month</span>
                                </span>
                              ) : (
                                <span className="text-white/20 text-[10px] italic">Enable Pre-Leased to see calculation</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-white/5 w-full"></div>

                        {/* ROW 5: ASSURED RETURN */}
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Assured Return</label>
                              <label className="flex items-center gap-3 bg-white/5 w-fit p-3 px-5 rounded-xl border border-white/5 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded border-white/20 text-yellow-400 focus:ring-yellow-400" checked={config.assuredReturn} onChange={(e) => updateCommercialConfig(index, 'assuredReturn', e.target.checked)} />
                                <span className="text-sm font-bold text-white">Enable</span>
                              </label>
                            </div>

                            {config.assuredReturn && (
                              <div className="space-y-1 animate-fade-in">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Return rate (%)</label>
                                <input type="number" placeholder="e.g. 12" className="w-full bg-[#0a1628] border border-white/20 rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 font-bold text-white" value={config.assuredReturnPct || ''} onChange={(e) => updateCommercialConfig(index, 'assuredReturnPct', e.target.value)} />
                              </div>
                            )}
                          </div>

                          {config.assuredReturn && config.assuredReturnPct > 0 && (
                            <>
                              <div className="bg-yellow-400/5 rounded-[1.5rem] p-6 border border-yellow-400/20 animate-fade-in shadow-2xl shadow-yellow-400/5">
                                <h5 className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                  Investment Yield Projection
                                </h5>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                  <div className="bg-[#0a1628]/40 p-4 rounded-xl border border-white/5">
                                    <div className="text-[9px] text-gray-400 uppercase font-bold mb-1">Capital</div>
                                    <div className="text-sm font-black text-white">₹{(config.ticketSize || 0).toLocaleString()}</div>
                                  </div>
                                  <div className="bg-[#0a1628]/40 p-4 rounded-xl border border-white/5">
                                    <div className="text-[9px] text-gray-400 uppercase font-bold mb-1">Yield</div>
                                    <div className="text-sm font-black text-yellow-400">{config.assuredReturnPct}%</div>
                                  </div>
                                  <div className="bg-[#0a1628]/40 p-4 rounded-xl border border-white/5">
                                    <div className="text-[9px] text-gray-400 uppercase font-bold mb-1">Annual</div>
                                    <div className="text-sm font-black text-green-400">₹{((config.ticketSize || 0) * (config.assuredReturnPct / 100)).toLocaleString()}</div>
                                  </div>
                                  <div className="bg-yellow-400 p-4 rounded-xl">
                                    <div className="text-[9px] text-[#0a1628] uppercase font-black mb-1 opacity-60">Result ({config.assuredReturnPerMonth ? 'Monthly' : 'Annual'})</div>
                                    <div className="text-lg font-black text-[#0a1628]">
                                      ₹{((config.ticketSize || 0) * (config.assuredReturnPct / 100) / (config.assuredReturnPerMonth ? 12 : 1)).toLocaleString()}
                                      <span className="text-[10px] ml-1 opacity-70">{config.assuredReturnPerMonth ? '/mo' : '/yr'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 animate-fade-in mt-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Payout Frequency</label>
                                <label className="flex items-center gap-3 bg-white/5 w-fit p-3 px-5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                                  <input type="checkbox" className="w-5 h-5 rounded border-white/20 text-yellow-400 focus:ring-yellow-400" checked={config.assuredReturnPerMonth} onChange={(e) => updateCommercialConfig(index, 'assuredReturnPerMonth', e.target.checked)} />
                                  <span className="text-sm font-bold text-white">Monthly Payout</span>
                                </label>
                              </div>
                            </>
                          )}
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
                  <button type="button" onClick={() => setFormData({ ...formData, productImages: [...formData.productImages, ''] })} className="text-cyan-600 font-bold flex items-center gap-2 hover:text-cyan-700 text-sm">
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

              {/* More Photos Section */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-[#0a1628]">More Photos</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Upload additional property photos for the gallery</p>
                  </div>
                  <button type="button" onClick={() => setFormData({ ...formData, morePhotos: [...formData.morePhotos, ''] })} className="text-cyan-600 font-bold flex items-center gap-2 hover:text-cyan-700 text-sm">
                    <Plus className="w-4 h-4" /> Add Photo
                  </button>
                </div>
                {formData.morePhotos.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No additional photos added yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.morePhotos.map((url: string, idx: number) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input type="text" placeholder="Image URL" value={url} onChange={(e) => {
                          const newPhotos = [...formData.morePhotos];
                          newPhotos[idx] = e.target.value;
                          setFormData({ ...formData, morePhotos: newPhotos });
                        }} className="flex-1 bg-gray-50 border-none rounded-xl p-3 font-medium text-sm" />
                        <label className={`cursor-pointer px-4 py-3 rounded-xl flex items-center justify-center transition-all ${uploadingField === `morePhotos-${idx}` ? 'bg-gray-200 text-gray-400' : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white'}`}>
                          {uploadingField === `morePhotos-${idx}` ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-cyan-500 animate-spin rounded-full"></div>
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'morePhotos', idx)} />
                        </label>
                        <button type="button" onClick={() => {
                          const newPhotos = formData.morePhotos.filter((_: any, i: number) => i !== idx);
                          setFormData({ ...formData, morePhotos: newPhotos });
                        }} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {url && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Brochure PDF</label>
                  <div className="flex gap-3">
                    <input type="text" className="flex-1 bg-gray-50 border-none rounded-2xl p-5" value={formData.brochureUrl} onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })} />
                    <label className="cursor-pointer px-5 py-5 bg-cyan-100 text-cyan-700 rounded-2xl hover:bg-cyan-700 hover:text-white transition-all">
                      <Upload className="w-5 h-5" />
                      <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'brochureUrl')} />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price List</label>
                  <div className="flex gap-3">
                    <input type="text" className="flex-1 bg-gray-50 border-none rounded-2xl p-5" value={formData.priceListUrl} onChange={(e) => setFormData({ ...formData, priceListUrl: e.target.value })} />
                    <label className="cursor-pointer px-5 py-5 bg-cyan-100 text-cyan-700 rounded-2xl hover:bg-cyan-700 hover:text-white transition-all">
                      <Upload className="w-5 h-5" />
                      <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'priceListUrl')} />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Site Plan</label>
                  <div className="flex gap-3">
                    <input type="text" className="flex-1 bg-gray-50 border-none rounded-2xl p-5" value={formData.sitePlanUrl} onChange={(e) => setFormData({ ...formData, sitePlanUrl: e.target.value })} />
                    <label className="cursor-pointer px-5 py-5 bg-cyan-100 text-cyan-700 rounded-2xl hover:bg-cyan-700 hover:text-white transition-all">
                      <Upload className="w-5 h-5" />
                      <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'sitePlanUrl')} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: Description */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
              <h3 className="text-xl font-black tracking-tight uppercase">7. Project Description</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">About the Project</label>
                <textarea rows={5} placeholder="Describe the project..." className="w-full bg-gray-50 border-none rounded-2xl p-5" value={formData.aboutProject} onChange={(e) => setFormData({ ...formData, aboutProject: e.target.value })} />
              </div>
            </div>
          </div>

          {/* SECTION 8: Google Maps Integration */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm border-t-8 border-t-indigo-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
              <h3 className="text-xl font-black tracking-tight uppercase">8. Google Maps Location</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Google Maps URL (Embed Code or Link)</label>
                <input type="text" placeholder="Paste Google Maps URL or Embed script here..." className="w-full bg-gray-50 border-none rounded-2xl p-5" value={formData.googleMapsUrl} onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })} />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Paste the "Embed a map" SRC URL or the entire iframe tag from Google Maps.</p>
              </div>
              {formData.googleMapsUrl && (
                <div className="w-full h-[300px] rounded-2xl overflow-hidden border-4 border-indigo-50 shadow-inner">
                   <iframe
                      src={(() => {
                        const url = formData.googleMapsUrl || '';
                        if (url.includes('<iframe')) return url.match(/src="([^"]+)"/)?.[1] || url;
                        if (url.includes('/maps/embed') || url.includes('output=embed')) return url;
                        if (url.includes('/maps/place/')) {
                          const place = url.split('/maps/place/')[1]?.split('/')[0];
                          if (place) return `https://www.google.com/maps?q=${place}&output=embed`;
                        }
                        if (url.includes('/maps/search/')) {
                          const search = url.split('/maps/search/')[1]?.split('/')[0];
                          if (search) return `https://www.google.com/maps?q=${search}&output=embed`;
                        }
                        return url + (url.includes('?') ? '&' : '?') + 'output=embed';
                      })()}
                      className="w-full h-full border-0 bg-gray-50"
                      title="Google Maps Preview"
                      loading="lazy"
                    />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 8.5: Nearby Locations (Strategic Location) */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm border-t-8 border-t-emerald-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
              <h3 className="text-xl font-black tracking-tight uppercase">8.5. Nearby Locations</h3>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Add nearby landmarks to show in the Strategic Location section on the property page.</p>
            
            <div className="space-y-3 mb-6">
              {(formData.nearbyLocations || []).map((loc, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="e.g. Metro Station"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium"
                      value={loc.name}
                      onChange={(e) => {
                        const updated = [...formData.nearbyLocations];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setFormData({ ...formData, nearbyLocations: updated });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="e.g. 5 min, 10 min"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium"
                      value={loc.distance}
                      onChange={(e) => {
                        const updated = [...formData.nearbyLocations];
                        updated[idx] = { ...updated[idx], distance: e.target.value };
                        setFormData({ ...formData, nearbyLocations: updated });
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.nearbyLocations.filter((_, i) => i !== idx);
                      setFormData({ ...formData, nearbyLocations: updated });
                    }}
                    className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl flex items-center justify-center transition-colors shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  nearbyLocations: [...(formData.nearbyLocations || []), { name: '', distance: '' }]
                });
              }}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-2xl p-4 font-black text-xs uppercase tracking-widest transition-colors border border-emerald-200 border-dashed"
            >
              + Add Nearby Location
            </button>
          </div>

          {/* SECTION 9: Amenities & Promotion */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm border-t-8 border-t-orange-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
              <h3 className="text-xl font-black tracking-tight uppercase">9. Promotion & Amenities</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h4 className="text-sm font-black text-[#0a1628] uppercase tracking-widest mb-6">Key Amenities</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['Swimming Pool', 'Gymnasium', 'Clubhouse', 'Childrens Play Area', 'Covered Parking', '24/7 Security', 'Power Backup', 'Landscaped Gardens'].map((amenity) => (
                    <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500" checked={formData.amenities.includes(amenity)} onChange={(e) => {
                        const newAmenities = e.target.checked ? [...formData.amenities, amenity] : formData.amenities.filter(a => a !== amenity);
                        setFormData({ ...formData, amenities: newAmenities });
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
                      <input type="checkbox" className="sr-only" checked={formData.isPromoted} onChange={(e) => setFormData({ ...formData, isPromoted: e.target.checked })} />
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
                      <input type="checkbox" className="sr-only" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
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
                      <input type="checkbox" className="sr-only" checked={formData.showOnYamunaExpressway} onChange={(e) => setFormData({ ...formData, showOnYamunaExpressway: e.target.checked })} />
                      <div className={`w-14 h-8 rounded-full transition-all ${formData.showOnYamunaExpressway ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.showOnYamunaExpressway ? 'translate-x-6' : ''}`}></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm cursor-pointer border-t border-gray-50 pt-6 mt-2">
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-[#0a1628]">Visible on Website</span>
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-left">Show/Hide from property listings</span>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={formData.isVisible} onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })} />
                      <div className={`w-14 h-8 rounded-full transition-all ${formData.isVisible ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
                      <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isVisible ? 'translate-x-6' : ''}`}></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* PUBLISH BUTTON - At End */}
          <div className="flex justify-center pt-8 pb-4">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-12 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20 active:scale-95 text-lg"
            >
              {saving ? 'Publishing...' : <><Save className="w-6 h-6" /> Publish Project</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
