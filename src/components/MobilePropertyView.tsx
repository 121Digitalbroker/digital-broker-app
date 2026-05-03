"use client";
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, Share2, Heart, MapPin, Phone, Download,
  Building, Ruler, Layers, ShieldCheck, ArrowRight, Info,
  Zap, Car, TreePine, Baby, Users, Bike, Wind, Droplets,
  Dumbbell, PlayCircle, UtensilsCrossed, Coffee, Gamepad2, Dog,
  CheckCircle, Calendar
} from 'lucide-react';
import InteractivePriceBreakup from './InteractivePriceBreakup';
import DocumentsSection from './DocumentsSection';
import dynamic from 'next/dynamic';

const LeadModal = dynamic(() => import('./LeadModal'), { ssr: false });

const amenityIcons: Record<string, any> = {
  'Swimming Pool': Droplets, 'Gym & Fitness': Dumbbell, '24/7 Security': ShieldCheck,
  'Power Backup': Zap, 'Covered Parking': Car, 'Landscaped Garden': TreePine,
  'Children Play Area': Baby, 'Clubhouse': Users, 'Jogging Track': Bike,
  'Wi-Fi Connectivity': Zap, // using zap as fallback
  'Cafeteria': Coffee, 'Indoor Games': Gamepad2,
  'Pet Friendly': Dog, 'Restaurant': UtensilsCrossed, 'Theatre': PlayCircle,
  'Central AC': Wind
};

export default function MobilePropertyView({
  p,
  ticketDisplay,
  allImgs,
  resConfigs,
  comConfigs,
  developerName,
  title,
  city,
  sector,
  amenities,
  similarProperties,
}: any) {
  const [activeImage, setActiveImage] = useState(0);
  const [isReadMore, setIsReadMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 10000); // 10 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const heroImage = allImgs.length > 0 ? allImgs[0] : '';
  const locationStr = sector ? `${sector}, ${city}` : city;
  const propType = String(p.propertyType || p.type || '');
  const status = String(p.projectStatus || p.badge || 'New Launch');
  const rera = String(p.reraNumber || 'RERA Pending');
  const projectSize = p.projectSize ? `${p.projectSize} Acres` : p.sqft ? `${p.sqft} sqft` : '--';

  const isResidential = propType === 'residential' || propType === 'both';

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

  const possession = (resConfigs.length > 0 && resConfigs[0].possessionYear)
    ? `${resConfigs[0].possessionYear}`.trim()
    : p.projectStatus || 'Ready to Move';

  // Navigation handlers
  const handleCall = () => window.open('tel:+919217976577');
  const handleWhatsApp = () => window.open(`https://wa.me/919217976577?text=Hi, I am interested in ${title}`, '_blank');
  const handleDownload = () => p.brochureUrl && window.open(p.brochureUrl, '_blank');

  return (
    <div className="block lg:hidden bg-[#f5f6fa] pb-28">
      {/* ── HEADER DESIGN (Sticky, Transparent) ── */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={() => window.history.back()} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-3">
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"><Share2 className="w-5 h-5" /></button>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"><Heart className="w-5 h-5" /></button>
        </div>
      </header>

      {/* ── HERO IMAGE SECTION ── */}
      <div className="relative w-full h-[45vh] overflow-hidden rounded-b-[2rem] shadow-sm">
        <div className="flex transition-transform duration-300 h-full w-full" style={{ transform: `translateX(-${activeImage * 100}%)` }}>
          {allImgs.map((img: string, i: number) => (
            <img key={i} src={img} className="w-full h-full object-cover shrink-0" alt={`${title} ${i}`} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/20 to-transparent" />

        {/* Pagination Dots */}
        {allImgs.length > 1 && (
          <div className="absolute top-24 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black tracking-widest">
            {activeImage + 1} / {allImgs.length}
          </div>
        )}
        <div className="absolute top-24 left-4 h-[25vh] w-1/2" onClick={() => setActiveImage(Math.max(0, activeImage - 1))}></div>
        <div className="absolute top-24 right-4 h-[25vh] w-1/2" onClick={() => setActiveImage(Math.min(allImgs.length - 1, activeImage + 1))}></div>

        <div className="absolute bottom-6 left-5 right-5 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-orange-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">{status}</span>
            <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">{developerName}</span>
          </div>
          <h1 className="text-3xl font-black leading-tight tracking-tight mb-2 drop-shadow-md">{title}</h1>
          <div className="flex items-center gap-1.5 text-orange-100 text-sm font-medium drop-shadow-md">
            <MapPin className="w-4 h-4 text-orange-400" /> {locationStr}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 relative z-10 space-y-6">

        {/* ── PRICE + CONFIGURATION ROW ── */}
        <div className="bg-white rounded-3xl p-5 shadow-lg shadow-[#0a1628]/5 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Starting Price</p>
            <p className="text-2xl font-black text-[#0a1628] leading-none mb-1">{ticketDisplay}</p>
            <p className="text-xs text-gray-400 font-medium">{isResidential ? resTypologies : comTypes}</p>
          </div>
          <div className="bg-orange-50 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border border-orange-100">
            <Layers className="w-6 h-6 text-orange-500 mb-1" />
            <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Explore</span>
          </div>
        </div>

        {/* ── QUICK ACTION BUTTONS ── */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleCall} className="bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-colors border border-blue-100">
            <Phone className="w-6 h-6" />
            <span className="text-[10px] items-center font-black uppercase tracking-wider">Call Now</span>
          </button>
          <button onClick={handleWhatsApp} className="bg-green-50 hover:bg-green-100 text-green-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-colors border border-green-100">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            <span className="text-[10px] font-black uppercase tracking-wider text-center">WhatsApp</span>
          </button>
        </div>

        {/* ── PROPERTY HIGHLIGHTS CARD ── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-[#0a1628] mb-5 flex items-center gap-2 border-b border-gray-50 pb-4">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
            Highlights
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div className="flex gap-3 items-start">
              <Layers className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Config</p>
                <p className="text-sm font-black text-[#0a1628] leading-tight">{isResidential ? resTypologies : comTypes}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Ruler className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Unit Size</p>
                <p className="text-sm font-black text-[#0a1628] leading-tight">{resUnitSize}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Project Area</p>
                <p className="text-sm font-black text-[#0a1628] leading-tight">{projectSize}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Possession</p>
                <p className="text-sm font-black text-[#0a1628] leading-tight">{possession}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start overflow-hidden">
              <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">RERA ID</p>
                <p className="text-sm font-black text-blue-600 leading-tight truncate">{rera}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start overflow-hidden">
              <Building className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Builder</p>
                <p className="text-sm font-black text-[#0a1628] leading-tight truncate">{developerName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── OVERVIEW SECTION ── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-[#0a1628] mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
            About Project
          </h3>
          <div>
            <p className={`text-sm text-gray-500 leading-relaxed transition-all duration-300 ${!isReadMore ? 'line-clamp-4' : ''}`}>
              {p.aboutProject || `Setting new benchmarks in luxury living, ${title} offers an unparalleled lifestyle in the heart of ${city || 'India'}. Designed by award-winning architects, this ${status.toLowerCase()} development combines contemporary aesthetics with world-class amenities.`}
            </p>
            <button
              onClick={() => setIsReadMore(!isReadMore)}
              className="mt-2 text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-1"
            >
              {isReadMore ? 'Show Less' : 'Read More'}
            </button>
          </div>
          <ul className="space-y-2 mt-4 pt-4 border-t border-gray-50">
            {[`Located in ${locationStr}`, 'Premium luxury residences', 'High appreciation potential', 'Close to schools & hospitals'].map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-[#0a1628] font-bold">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* ── AMENITIES SECTION ── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-[#0a1628] mb-5 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
            Amenities
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {amenities.slice(0, 8).map((amenity: string, i: number) => {
              const IconComp = amenityIcons[amenity] || CheckCircle;
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <IconComp className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="text-[11px] font-black text-[#0a1628] leading-tight flex-1">{amenity}</span>
                </div>
              );
            })}
          </div>
          {amenities.length > 8 && (
            <button className="w-full mt-4 py-3 text-orange-600 font-bold text-xs bg-orange-50 rounded-xl transition-colors active:bg-orange-100">
              View All {amenities.length} Amenities
            </button>
          )}
        </div>

        {/* ── PRICE BREAKUP ── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden break-inside-avoid">
          <InteractivePriceBreakup
            resConfigs={resConfigs}
            comConfigs={comConfigs}
            propertyId={String(p._id || '')}
            propertyTitle={title}
          />
        </div>

        {/* ── DOCUMENTS & APPROVALS ── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden">
          <DocumentsSection propertyId={p._id} propertyTitle={title} brochureUrl={p.brochureUrl} priceListUrl={p.priceListUrl} sitePlanUrl={p.sitePlanUrl} layoutPlanUrl={p.layoutPlanUrl} />
        </div>

        {/* ── LOCATION ADVANTAGES ── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-[#0a1628] mb-5 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
            Location & Connectivity
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {(p.nearbyLocations && p.nearbyLocations.length > 0 ? p.nearbyLocations : []).map((l: any, i: number) => (
              <div key={i} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0">
                <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center shrink-0 mt-0.5 border border-orange-100">
                  <MapPin className="w-3 h-3 text-orange-500" />
                </div>
                <div>
                  <p className="text-[11px] font-black leading-tight mb-0.5 truncate max-w-[100px]">{l.name}</p>
                  <p className="text-[9px] font-bold text-gray-400">{l.distance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BUILDER SECTION ── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 p-2 shadow-sm border border-gray-100">
            {p.developerLogo ? (
              <img src={p.developerLogo} alt={developerName} className="max-w-full max-h-full object-contain" />
            ) : (
              <Building className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-black text-[#0a1628] mb-2">{developerName}</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-5">
            One of India's premier real estate developers with a solid legacy of delivering premium residential and commercial projects.
          </p>
          <button className="text-[10px] font-black uppercase tracking-widest text-[#0a1628] py-2.5 px-6 rounded-full border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors">
            View All Projects
          </button>
        </div>

        {/* ── SIMILAR PROJECTS ── */}
        {similarProperties && similarProperties.length > 0 && (
          <div className="space-y-5 pb-4">
            <h3 className="text-xl font-black text-[#0a1628] flex items-center gap-2">
              <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
              Similar Projects
            </h3>
            <div className="flex flex-col gap-4">
              {similarProperties.map((sp: any) => {
                const slugBase = `${sp.projectName || sp.title}-${sp.sector || ''}-${sp.city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                const propertyUrl = `/properties/${sp.slug || `${slugBase}-${sp._id}`}`;
                return (
                <a key={sp._id} href={propertyUrl} className="bg-white rounded-3xl flex overflow-hidden border border-gray-100 shadow-sm active:scale-[0.98] transition-all">
                  <div className="w-32 h-32 shrink-0">
                    <img src={sp.productImages?.[0] || sp.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop'} alt={sp.projectName} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex flex-col justify-center min-w-0 flex-1">
                    <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mb-1 truncate">{sp.developerName}</p>
                    <h4 className="text-sm font-black text-[#0a1628] leading-tight mb-1 truncate">{sp.projectName || sp.title}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2 truncate">
                      <MapPin className="w-3 h-3 text-orange-400" /> {sp.sector}, {sp.city}
                    </div>
                    <p className="text-xs font-black text-orange-600">₹{(sp.residentialConfigs?.[0]?.ticketSize / 10000000).toFixed(1)}Cr+</p>
                  </div>
                </a>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ── STICKY BOTTOM CTA BAR ── */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-gray-100">
        <div className="flex gap-2">
          <button onClick={handleCall} className="w-12 h-12 bg-blue-50/80 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 active:scale-95 transition-transform">
            <Phone className="w-5 h-5 text-blue-600" />
          </button>
          <button onClick={handleWhatsApp} className="w-12 h-12 bg-[#25D366]/10 rounded-2xl flex items-center justify-center shrink-0 border border-[#25D366]/20 active:scale-95 transition-transform">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl flex items-center justify-center gap-2 font-bold uppercase text-[11px] tracking-wide shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
          >
            Schedule Visit <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── MOBILE LEAD MODAL (DYNAMIC SSR: FALSE) ── */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        propertyId={p._id}
      />
    </div>
  );
}
