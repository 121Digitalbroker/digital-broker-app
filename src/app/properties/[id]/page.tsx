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

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  await dbConnect();
  const raw = await Property.findById(id).lean() as any;
  if (!raw) return { title: 'Property Not Found - Digital Broker' };

  const imgs: string[] = Array.isArray(raw.productImages) ? raw.productImages : Array.isArray(raw.images) ? raw.images : [];
  const heroImg = imgs.length > 0 ? String(imgs[0]) : '';

  return {
    title: `${raw.projectName || raw.title || 'Property'} in ${raw.city || raw.location || ''} | Digital Broker`,
    description: `Explore ${raw.projectName || raw.title || 'Property'}, a premium ${raw.propertyType || raw.type || ''} property in ${raw.city || raw.location || ''}.`,
    openGraph: {
      title: String(raw.projectName || raw.title || 'Property'),
      description: `Premium property in ${raw.city || raw.location || 'India'}`,
      images: heroImg ? [heroImg] : [],
    },
  };
}

async function getProperty(id: string) {
  await dbConnect();
  return Property.findById(id).lean();
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

  const resConfigs: any[] = Array.isArray(p.residentialConfigs) ? p.residentialConfigs : [];
  const comConfigs: any[] = Array.isArray(p.commercialConfigs) ? p.commercialConfigs : [];

  const isResidential = propType === 'residential' || propType === 'both';
  const isCommercial = propType === 'commercial';
  const possession = (resConfigs.length > 0 && resConfigs[0].possessionYear)
    ? `${resConfigs[0].possessionMonth || ''} ${resConfigs[0].possessionYear}`.trim()
    : (comConfigs.length > 0 && comConfigs[0].possessionYear)
    ? `${comConfigs[0].possessionMonth || ''} ${comConfigs[0].possessionYear}`.trim()
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
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: HERO IMAGE GALLERY
      ═══════════════════════════════════════════════════════════════ */}
      <div className="pt-24 pb-4 container mx-auto px-4 md:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 overflow-x-auto whitespace-nowrap">
          <a href="/" className="hover:text-orange-500 transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <a href="/search" className="hover:text-orange-500 transition-colors">{isResidential ? 'Residential' : 'Commercial'}</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0a1628] font-semibold">{title}</span>
        </nav>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-8 rounded-3xl overflow-hidden">
          {/* Main Image */}
          <div className="lg:col-span-2 lg:row-span-2 h-[300px] lg:h-full min-h-[400px] relative group cursor-pointer">
            <img src={heroImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {status && (
              <div className="absolute top-5 left-5 bg-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                {status}
              </div>
            )}
            <div className="absolute bottom-5 left-5 flex gap-3">
              <button className="bg-white/15 backdrop-blur-md hover:bg-white/30 text-white p-2.5 rounded-xl transition-all border border-white/20">
                <Heart className="w-4 h-4" />
              </button>
              <button className="bg-white/15 backdrop-blur-md hover:bg-white/30 text-white p-2.5 rounded-xl transition-all border border-white/20">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Side images */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-[200px] relative group cursor-pointer overflow-hidden ${i > 2 ? 'hidden lg:block' : ''}`}>
              <img
                src={allImgs[i] || FALLBACK_IMG}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={`${title} ${i + 1}`}
              />
              {i === 4 && allImgs.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">+{allImgs.length - 5} Photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: MAIN CONTENT + SIDEBAR
      ═══════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* ─── Property Header ─── */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  {/* Developer Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    {developerLogo && (
                      <img src={developerLogo} alt={developerName} className="w-10 h-10 rounded-full object-contain bg-gray-50 border border-gray-100 p-0.5" />
                    )}
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{developerName}</span>
                    <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">Verified</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-3 leading-tight">
                    {title}
                  </h1>

                  <div className="flex items-center gap-2 text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">{locationStr}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{status}</span>
                    <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{propType}</span>
                    <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />{rera}
                    </span>
                  </div>
                </div>

                {/* Price Badge */}
                <div className="bg-[#0a1628] rounded-2xl p-6 text-white min-w-[200px]">
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Starting From</p>
                  <p className="text-3xl font-black mb-1">{ticketDisplay}</p>
                  {pricePerSqft && <p className="text-blue-300 text-xs">₹{pricePerSqft.toLocaleString()} / sq.ft.</p>}
                </div>
              </div>
            </div>

            {/* ─── Quick Stats Bar ─── */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <Ruler className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project Size</p>
                    <p className="text-[#0a1628] font-bold text-lg">{projectSize}</p>
                  </div>
                </div>

                {isResidential ? (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <Home className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Config</p>
                        <p className="text-[#0a1628] font-bold text-lg">{resTypologies}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                        <Layers className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unit Size</p>
                        <p className="text-[#0a1628] font-bold text-lg">{resUnitSize} sqft</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <Building className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</p>
                        <p className="text-[#0a1628] font-bold text-lg">{comTypes}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Return</p>
                        <p className="text-[#0a1628] font-bold text-lg">{comReturn}%</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Possession</p>
                    <p className="text-[#0a1628] font-bold text-lg">{possession}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── About / Overview ─── */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
                About {title}
              </h2>
              <p className="text-gray-500 leading-relaxed text-[15px] mb-6">
                Setting new benchmarks in luxury living, {title} offers an unparalleled lifestyle in the heart of {city || 'India'}.
                Designed by award-winning architects, this {status.toLowerCase()} development combines contemporary aesthetics with world-class amenities.
                Whether you&apos;re looking for an investment or a home for your family, this project provides exceptional value and long-term appreciation potential.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Developer</p>
                    <p className="text-sm font-bold text-[#0a1628]">{developerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">RERA</p>
                    <p className="text-sm font-bold text-[#0a1628]">{rera}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Status</p>
                    <p className="text-sm font-bold text-[#0a1628]">{status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Price Breakup Table ─── */}
            <InteractivePriceBreakup resConfigs={resConfigs} comConfigs={comConfigs} />

            {/* ─── Amenities ─── */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
                Amenities &amp; Facilities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenities.map((amenity, i) => {
                  const IconComp = amenityIcons[amenity] || CheckCircle;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all group cursor-default"
                    >
                      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <IconComp className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-[13px] font-semibold text-[#0a1628]">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── Documents / Downloads ─── */}
            <DocumentsSection
              propertyId={id}
              propertyTitle={title}
              brochureUrl={brochureUrl}
              priceListUrl={priceListUrl}
              sitePlanUrl={sitePlanUrl}
              layoutPlanUrl={layoutPlanUrl}
            />

            {/* ─── Location Map ─── */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
                Location &amp; Connectivity
              </h2>
              {/* Map */}
              <div className="w-full h-[300px] rounded-2xl bg-gray-100 overflow-hidden relative mb-6">
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
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  title="Property Location"
                />
              </div>
              {/* Nearby Landmarks */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Metro Station', dist: '500m', icon: Navigation },
                  { name: 'Hospital', dist: '1.2 km', icon: ShieldCheck },
                  { name: 'Schools', dist: '800m', icon: Users },
                  { name: 'Shopping Mall', dist: '1.5 km', icon: Building },
                  { name: 'Airport', dist: '25 km', icon: Wind },
                  { name: 'Highway', dist: '2 km', icon: ArrowRight },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <l.icon className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-sm font-bold text-[#0a1628]">{l.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{l.dist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── EMI Calculator ─── */}
            {isResidential && !isCommercial && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in">
                <h2 className="text-2xl font-bold text-[#0a1628] mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
                  EMI Calculator
                </h2>
                <div className="bg-gradient-to-br from-[#0a1628] to-[#142240] rounded-2xl p-8 text-white shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-2">Loan Amount</p>
                      <p className="text-2xl font-black">{ticketDisplay}</p>
                    </div>
                    <div>
                      <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-2">Interest Rate</p>
                      <p className="text-2xl font-black">8.5% p.a.</p>
                    </div>
                    <div>
                      <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-2">Tenure</p>
                      <p className="text-2xl font-black">20 Years</p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Monthly EMI</p>
                      <p className="text-3xl font-black text-orange-400">
                        ₹{resTicket > 0
                          ? Math.round((resTicket * 0.8 * (0.085 / 12) * Math.pow(1 + 0.085 / 12, 240)) / (Math.pow(1 + 0.085 / 12, 240) - 1)).toLocaleString()
                          : '--'
                        }
                      </p>
                    </div>
                    <Calculator className="w-12 h-12 text-white/10" />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Similar Properties ─── */}
            {similarProperties.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0a1628] mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
                  Similar Properties
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {similarProperties.map((sp: any) => {
                    const spImg = (sp.productImages && sp.productImages.length > 0)
                      ? String(sp.productImages[0])
                      : FALLBACK_IMG;
                    const spName = sp.projectName || sp.title || 'Property';
                    const spLoc = sp.sector ? `${sp.sector}, ${sp.city}` : sp.city || '';
                    const spResTicket = sp.residentialConfigs?.[0]?.ticketSize || 0;
                    const spComTicket = sp.commercialConfigs?.[0]?.ticketSize || 0;
                    let spPrice = 'On Request';
                    if (sp.propertyType === 'commercial' && spComTicket > 0) {
                      spPrice = `₹${Math.round(spComTicket / 100000)}L+`;
                    } else if (spResTicket > 0) {
                      spPrice = `₹${(spResTicket / 10000000).toFixed(1)}Cr+`;
                    }

                    return (
                      <a key={sp._id} href={`/properties/${sp._id}`}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
                      >
                        <div className="h-[180px] relative overflow-hidden">
                          <img src={spImg} alt={spName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {sp.projectStatus && (
                            <div className="absolute top-3 left-3 bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">{sp.projectStatus}</div>
                          )}
                        </div>
                        <div className="p-5">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{sp.developerName || 'Developer'}</p>
                          <h3 className="font-bold text-[#0a1628] mb-2 group-hover:text-orange-500 transition-colors">{spName}</h3>
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                            <MapPin className="w-3 h-3" />{spLoc}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[#0a1628] text-lg">{spPrice}</span>
                            <span className="text-orange-500 text-xs font-bold flex items-center gap-1">View <ArrowRight className="w-3 h-3" /></span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN / SIDEBAR ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">

              {/* Pricing + Lead Form Card */}
              <div className="bg-[#0a1628] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 space-y-6">
                  <div>
                    <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-2">Starting Price</p>
                    <div className="text-4xl font-black mb-1">{ticketDisplay}</div>
                    {pricePerSqft && <p className="text-blue-300 text-xs">₹{pricePerSqft.toLocaleString()} per sqft</p>}
                  </div>
                  <div className="space-y-3">
                    <LeadForm propertyId={propId} propertyTitle={title} />
                    <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white py-4 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Brochure
                    </button>
                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/919217976577?text=Hi, I am interested in ${title} at ${locationStr}. Please share more details.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      WhatsApp Us
                    </a>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <Info className="w-4 h-4 text-blue-300 shrink-0" />
                    <p className="text-[11px] text-blue-200 font-medium leading-relaxed">
                      Our expert consultants are available for a private site visit this weekend.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agent Card removed as per user request */}

              {/* Why Choose Us */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h4 className="font-bold text-[#0a1628] text-sm mb-4 uppercase tracking-wider">Why Digital Broker?</h4>
                <div className="space-y-3">
                  {[
                    { icon: ShieldCheck, text: '100% Verified Properties', color: 'green' },
                    { icon: DollarSign, text: '0% Brokerage', color: 'orange' },
                    { icon: Users, text: 'Expert Consultation', color: 'blue' },
                    { icon: Clock, text: 'Instant Site Visits', color: 'purple' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-${item.color}-50 rounded-lg flex items-center justify-center`}>
                        <item.icon className={`w-4 h-4 text-${item.color}-500`} />
                      </div>
                      <span className="text-sm font-semibold text-[#0a1628]">{item.text}</span>
                    </div>
                  ))}
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
