import React from 'react';
import Navbar from '@/components/Navbar';
import ChatWidget from '@/components/ChatWidget';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import {
  MapPin, CheckCircle, Star, Calendar, Shield, Share2, Heart, Info,
  Phone, Download, ArrowRight, ChevronRight, Building, Ruler,
  DollarSign, Layers, Home, Clock, FileText, Image as ImageIcon,
  Wifi, Car, Dumbbell, TreePine, ShieldCheck, Zap, Wind, Droplets,
  Users, Baby, Dog, Bike, Coffee, UtensilsCrossed, Gamepad2,
  PlayCircle, TrendingUp, Calculator, Navigation, ExternalLink,
  Landmark
} from 'lucide-react';
import { Metadata } from 'next';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';
import InteractivePriceBreakup from '@/components/InteractivePriceBreakup';
import DocumentsSection from '@/components/DocumentsSection';
import ImagePopupGallery from '@/components/ImagePopupGallery';
import EmiCalculator from '@/components/EmiCalculator';
import MobilePropertyView from '@/components/MobilePropertyView';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  await dbConnect();
  
  const extractedId = id.split('-').pop() || id;
  const isValidId = extractedId.match(/^[0-9a-fA-F]{24}$/);
  
  const raw = await Property.findOne({
    $or: [
      { slug: id },
      ...(isValidId ? [{ _id: extractedId }] : [])
    ]
  }).lean() as any;
  if (!raw) return { title: 'Property Not Found - Digital Broker' };

  const imgs: string[] = Array.isArray(raw.productImages) ? raw.productImages : Array.isArray(raw.images) ? raw.images : [];
  const heroImg = imgs.length > 0 ? String(imgs[0]) : '';

  return {
    title: `${raw.projectName || raw.title || 'Property'} in ${raw.city || raw.location || ''} | Digital Broker`,
    description: `Explore ${raw.projectName || raw.title || 'Property'}, a premium ${raw.propertyType || raw.type || ''} property in ${raw.city || raw.location || ''}.`,
    keywords: raw.keywords || '',
    openGraph: {
      title: String(raw.projectName || raw.title || 'Property'),
      description: `Premium property in ${raw.city || raw.location || 'India'}`,
      images: heroImg ? [heroImg] : [],
    },
  };
}

async function getProperty(id: string) {
  await dbConnect();
  
  // The URL might be a clean SEO slug like "monarque-sector-22d-noida-65123abcd..."
  // The last part after the hyphen is usually the ObjectId if we format it that way.
  const extractedId = id.split('-').pop() || id;
  
  const isValidId = extractedId.match(/^[0-9a-fA-F]{24}$/);
  
  return Property.findOne({
    $or: [
      { slug: id }, // Exact slug match
      ...(isValidId ? [{ _id: extractedId }] : []) // Fallback to extracted ID
    ]
  }).lean();
}

async function getSimilarProperties(city: string, propType: string, excludeId: string) {
  await dbConnect();
  return Property.find({
    city,
    propertyType: propType,
    _id: { $ne: excludeId }
  }).limit(4).lean();
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <a href="/" className="text-orange-500 font-bold hover:underline">Back to Home</a>
        </div>
      </div>
    );
  }

  const p: any = JSON.parse(JSON.stringify(property));

  // ── Extract data ──
  const productImgs: string[] = Array.isArray(p.productImages) ? p.productImages.map(String) : [];
  const moreImgs: string[] = Array.isArray(p.morePhotos) ? p.morePhotos.map(String) : [];
  const oldImgs: string[] = Array.isArray(p.images) ? p.images.map(String) : [];
  const allImgs = [...(productImgs.length > 0 ? productImgs : oldImgs), ...moreImgs];
  const heroImage = allImgs.length > 0 ? allImgs[0] : FALLBACK_IMG;

  const title = String(p.projectName || p.title || 'Property');
  const developerName = String(p.developerName || 'Premium Developer');
  const developerLogo = p.developerLogo || null;
  const city = String(p.city || '');
  const sector = String(p.sector || p.location || '');
  const locationStr = sector ? `${sector}, ${city}` : city;
  const propType = String(p.propertyType || p.type || '');
  const status = String(p.projectStatus || p.badge || 'New Launch');
  const rera = String(p.reraNumber || 'RERA Registration Pending');
  const projectSize = p.projectSize ? `${p.projectSize} Acres` : p.sqft ? `${p.sqft} sqft` : '--';
  const loanable = String(p.loanable || 'NO');
  const nearbyLocations: { name: string; distance: string }[] = Array.isArray(p.nearbyLocations) ? p.nearbyLocations : [];

  const resConfigs: any[] = Array.isArray(p.residentialConfigs) ? p.residentialConfigs : [];
  const comConfigs: any[] = Array.isArray(p.commercialConfigs) ? p.commercialConfigs : [];

  const isResidential = propType === 'residential' || propType === 'both';
  const isCommercial = propType === 'commercial';
  const possession = (resConfigs.length > 0 && resConfigs[0].possessionYear)
    ? `${resConfigs[0].possessionYear}`.trim()
    : (comConfigs.length > 0 && comConfigs[0].possessionYear)
      ? `${comConfigs[0].possessionYear}`.trim()
      : p.projectStatus || 'Ready to Move';

  const resTypologies = resConfigs.length > 0
    ? resConfigs.map((c: any) => {
      const typology = String(c.typology || '');
      const servantRooms = Number(c.servantRooms) || 0;
      if (typology && servantRooms >= 1) {
        return `${typology} + ${servantRooms === 1 ? 'S' : servantRooms + 'S'}`;
      }
      return typology;
    }).filter(Boolean).join(', ')
    : `${p.bedrooms || '--'} BHK`;
  const resUnitSize = resConfigs.length > 0 ? String(resConfigs[0].unitSize || '--') : String(p.sqft || '--');
  const comTypes = comConfigs.length > 0
    ? comConfigs.map((c: any) => String(c.commercialType || '')).filter(Boolean).join(', ')
    : String(p.category || '--');
  const comReturn = comConfigs.length > 0 ? String(comConfigs[0].assuredReturnPct || '--') : '--';

  const resValid = resConfigs.map((c: any) => Number(c.ticketSize) || 0).filter(t => t > 0);
  const resTicket = resValid.length > 0 ? Math.min(...resValid) : 0;

  const comValid = comConfigs.map((c: any) => Number(c.ticketSize) || 0).filter(t => t > 0);
  const comTicket = comValid.length > 0 ? Math.min(...comValid) : 0;

  // Check if any config is loanable
  const isLoanable = isResidential
    ? resConfigs.some((c: any) => c.loanable === true)
    : comConfigs.some((c: any) => c.loanable === true);

  let ticketDisplay: string = p.price || 'On Request';
  if (propType === 'commercial' && comValid.length > 0) {
    const min = Math.min(...comValid);
    const max = Math.max(...comValid);
    const formatL = (val: number) => `₹ ${(val / 100000).toFixed(1)}L`;
    const formatCr = (val: number) => `₹ ${(val / 10000000).toFixed(2)}Cr`;
    const format = (val: number) => val >= 10000000 ? formatCr(val) : formatL(val);
    ticketDisplay = min === max ? `${format(min)}+` : `${format(min)} - ${format(max).replace('₹ ', '')}`;
  } else if (isResidential && resValid.length > 0) {
    const min = Math.min(...resValid);
    const max = Math.max(...resValid);
    const formatCr = (val: number) => `₹ ${(val / 10000000).toFixed(2)}Cr`;
    ticketDisplay = min === max ? `${formatCr(min)}+` : `${formatCr(min)} - ${formatCr(max).replace('₹ ', '')}`;
  }

  const pricePerSqft = resConfigs.length > 0 ? resConfigs[0].pricePerSqft : comConfigs.length > 0 ? comConfigs[0].pricePerSqft : null;

  const agentAvatar = String((p.agent && p.agent.avatar) ? p.agent.avatar : 'https://randomuser.me/api/portraits/men/32.jpg');
  const agentName = String((p.agent && p.agent.name) ? p.agent.name : 'Relationship Manager');
  const agentRating = String((p.agent && p.agent.rating) ? p.agent.rating : '4.8');
  const propId = String(p._id || '');

  const brochureUrl = p.brochureUrl || null;
  const priceListUrl = p.priceListUrl || null;
  const sitePlanUrl = p.sitePlanUrl || null;
  const layoutPlanUrl = p.layoutPlanUrl || null;
  const googleMapsUrl = p.googleMapsUrl || null;

  // Get similar properties
  let similarProperties: any[] = [];
  try {
    const similar = await getSimilarProperties(city, propType, propId);
    similarProperties = JSON.parse(JSON.stringify(similar));
  } catch {
    similarProperties = [];
  }

  // Amenities
  const amenityIcons: Record<string, any> = {
    'Swimming Pool': Droplets, 'Gym & Fitness': Dumbbell, '24/7 Security': ShieldCheck,
    'Power Backup': Zap, 'Covered Parking': Car, 'Landscaped Garden': TreePine,
    'Children Play Area': Baby, 'Clubhouse': Users, 'Jogging Track': Bike,
    'Wi-Fi Connectivity': Wifi, 'Cafeteria': Coffee, 'Indoor Games': Gamepad2,
    'Pet Friendly': Dog, 'Restaurant': UtensilsCrossed, 'Theatre': PlayCircle,
    'Central AC': Wind
  };

  const amenities = Object.keys(amenityIcons);

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans text-gray-900 overflow-x-hidden">
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <MobilePropertyView
        p={p}
        ticketDisplay={ticketDisplay}
        allImgs={allImgs}
        resConfigs={resConfigs}
        comConfigs={comConfigs}
        developerName={developerName}
        title={title}
        city={city}
        sector={sector}
        amenities={amenities}
        similarProperties={similarProperties}
      />

      <div className="hidden lg:block pt-12 max-w-[2000px] mx-auto px-4 md:px-8 lg:px-12 pb-20">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 py-2 overflow-x-auto whitespace-nowrap mb-8">
          <a href="/" className="hover:text-orange-500 transition-colors font-medium">Home</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <a href="/search" className="hover:text-orange-500 transition-colors font-medium">{isResidential ? 'Residential' : 'Commercial'}</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0a1628] font-bold">{title}</span>
        </nav>

        {/* MAIN LAYOUT: Header + Content | Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* ────── LEFT COLUMN: HEADER & CONTENT ────── */}
          <div className="space-y-6">

            {/* ── Property Header Info ── */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {developerLogo && (
                      <img src={developerLogo} alt={developerName} className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1.5 shadow-sm" />
                    )}
                    <h2 className="text-3xl md:text-4xl font-black text-[#0a1628] uppercase tracking-wide">{developerName}</h2>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-500 leading-tight mb-3">{title}</h1>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                    <span className="font-medium text-base">{locationStr}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <span className="bg-[#f0f4f8] text-[#3b82f6] px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider">{status}</span>
                  <span className="bg-[#fdf4e4] text-[#f97316] px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider">{propType}</span>
                  <span className="bg-gray-100 text-gray-500 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />{rera}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Image Gallery (Client Component with Lightbox) ── */}
            <ImagePopupGallery images={allImgs} title={title} status={status} />


            {/* ── Quick Stats ── */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-8 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#fdf4e4] rounded-2xl flex items-center justify-center shrink-0">
                    <Ruler className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Project Size</p>
                    <p className="text-[#0a1628] font-black text-lg leading-tight">{projectSize}</p>
                  </div>
                </div>
                {isResidential ? (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f0f4f8] rounded-2xl flex items-center justify-center shrink-0">
                        <Home className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Config</p>
                        <p className="text-[#0a1628] font-black text-lg leading-tight">{resTypologies}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f0f4f8] rounded-2xl flex items-center justify-center shrink-0">
                        <Layers className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Unit Size</p>
                        <p className="text-[#0a1628] font-black text-lg leading-tight">{resUnitSize} sqft</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f0f4f8] rounded-2xl flex items-center justify-center shrink-0">
                        <Building className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Type</p>
                        <p className="text-[#0a1628] font-black text-lg leading-tight">{comTypes}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#fdf4e4] rounded-2xl flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Return</p>
                        <p className="text-[#0a1628] font-black text-lg leading-tight">{comReturn}%</p>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f0f4f8] rounded-2xl flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Possession</p>
                    <p className="text-[#0a1628] font-black text-lg leading-tight">{possession}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-[#0a1628] mb-6 flex items-center gap-4">
                <div className="w-2 h-10 bg-orange-500 rounded-full" />
                Overview
              </h2>
              <p className="text-gray-500 leading-relaxed text-lg mb-8">
                {p.aboutProject || `Setting new benchmarks in luxury living, ${title} offers an unparalleled lifestyle in the heart of ${city || 'India'}. Designed by award-winning architects, this ${status.toLowerCase()} development combines contemporary aesthetics with world-class amenities.`}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-orange-100/50 p-4 rounded-2xl border border-orange-100">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest">Developer</p>
                    <p className="text-lg font-black text-[#0a1628]">{developerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">RERA No.</p>
                    <p className="text-sm font-bold text-[#0a1628]">{rera}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Build Status</p>
                    <p className="text-sm font-bold text-[#0a1628]">{status}</p>
                  </div>
                </div>
                {loanable && loanable !== 'NO' && (
                  <div className="flex items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-100/50 p-4 rounded-2xl border border-green-100">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Loanable</p>
                      <p className="text-sm font-black text-green-700">{loanable}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <InteractivePriceBreakup resConfigs={resConfigs} comConfigs={comConfigs} />

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-[#0a1628] mb-8 flex items-center gap-4">
                <div className="w-2 h-10 bg-orange-500 rounded-full" />
                World Class Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenities.map((amenity, i) => {
                  const IconComp = amenityIcons[amenity] || CheckCircle;
                  return (
                    <div key={i} className="flex flex-col items-center text-center p-6 rounded-[2rem] bg-gray-50 border border-transparent hover:border-orange-200 hover:bg-orange-50/30 transition-all group">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all mb-4">
                        <IconComp className="w-6 h-6 text-orange-500" />
                      </div>
                      <span className="text-xs font-black text-[#0a1628] uppercase tracking-wider">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <DocumentsSection propertyId={id} propertyTitle={title} brochureUrl={brochureUrl} priceListUrl={priceListUrl} sitePlanUrl={sitePlanUrl} layoutPlanUrl={null} />

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-[#0a1628] mb-8 flex items-center gap-4">
                <div className="w-2 h-10 bg-orange-500 rounded-full" />
                Strategic Location
              </h2>
              <div className="w-full h-[400px] rounded-3xl bg-gray-100 overflow-hidden mb-8 border border-gray-200">
                <iframe
                  src={(() => {
                    const url = googleMapsUrl || '';
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
                    return url ? (url + (url.includes('?') ? '&' : '?') + 'output=embed') : `https://www.google.com/maps?q=${encodeURIComponent(locationStr)}&output=embed`;
                  })()}
                  className="w-full h-full border-0" loading="lazy" allowFullScreen title="Map"
                />
              </div>
              {nearbyLocations.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {nearbyLocations.map((l, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <MapPin className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#0a1628]">{l.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{l.distance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isResidential && !isCommercial && (
              <EmiCalculator initialAmount={resTicket} ticketDisplay={ticketDisplay} />
            )}


            {similarProperties.length > 0 && (
              <div className="pt-10">
                <h2 className="text-3xl font-black text-[#0a1628] mb-8 flex items-center gap-4">
                  <div className="w-2 h-10 bg-orange-500 rounded-full" />
                  Similar Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {similarProperties.map((sp: any) => {
                    const slugBase = `${sp.projectName || sp.title}-${sp.sector || ''}-${sp.city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    const propertyUrl = `/properties/${sp.slug || `${slugBase}-${sp._id}`}`;
                    return (
                    <a key={sp._id} href={propertyUrl} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
                      <div className="h-[220px] relative">
                        <img src={(sp.productImages && sp.productImages.length > 0) ? String(sp.productImages[0]) : FALLBACK_IMG} alt={sp.projectName} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 bg-orange-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase shadow-lg">{sp.projectStatus}</div>
                      </div>
                      <div className="p-6">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{sp.developerName}</p>
                        <h3 className="text-xl font-black text-[#0a1628] mb-3 group-hover:text-orange-500 transition-colors">{sp.projectName || sp.title}</h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                          <MapPin className="w-4 h-4 text-orange-500" /> {sp.sector}, {sp.city}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <span className="font-black text-[#0a1628] text-xl">₹{(sp.residentialConfigs?.[0]?.ticketSize / 10000000).toFixed(1)}Cr+</span>
                          <span className="bg-orange-50 text-orange-500 px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
                        </div>
                      </div>
                    </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ────── RIGHT COLUMN: SIDEBAR ────── */}
          <div className="relative">
            <div className="sticky top-28 bg-[#0b1324] rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden h-fit">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="relative z-10 flex flex-col flex-1">
                <div className="mb-8">
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-2 opacity-80">Investment Starts At</p>
                  <div className="text-4xl font-black mb-1">{ticketDisplay}</div>
                </div>

                <div className="mb-6">
                  <LeadForm propertyId={propId} propertyTitle={title} />
                </div>

                <div className="space-y-4 pt-4">

                  <a href={`https://wa.me/919217976577?text=Hi, I'm interested in ${title}`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#1db954] hover:bg-[#19a34a] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    WhatsApp Consultant
                  </a>
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <Info className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-100/60 leading-relaxed font-bold uppercase tracking-wider">Expert consultants are available for a private site visit this weekend.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
