import React from 'react';
import Navbar from '@/components/Navbar';
import ChatWidget from '@/components/ChatWidget';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { MapPin, CheckCircle, Star, Calendar, Shield, Share2, Heart, Info } from 'lucide-react';
import { Metadata } from 'next';
import LeadForm from '@/components/LeadForm';

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

  // Safe plain object — no Mongoose DocumentArray quirks
  const p: any = JSON.parse(JSON.stringify(property));

  // ── Extract ALL data safely BEFORE JSX — no array[0] in the render tree ──
  const productImgs: string[] = Array.isArray(p.productImages) ? p.productImages.map(String) : [];
  const oldImgs: string[]     = Array.isArray(p.images)        ? p.images.map(String)        : [];
  const allImgs                = productImgs.length > 0 ? productImgs : oldImgs;
  const heroImage              = allImgs.length > 0 ? allImgs[0] : FALLBACK_IMG;

  const title       = String(p.projectName   || p.title    || 'Property');
  const city        = String(p.city          || '');
  const sector      = String(p.sector        || p.location || '');
  const locationStr = sector ? `${sector}, ${city}` : city;
  const propType    = String(p.propertyType  || p.type     || '');
  const status      = String(p.projectStatus || p.badge    || 'New Launch');
  const rera        = String(p.reraNumber    || 'RERA Registration Pending');
  const projectSize = p.projectSize ? `${p.projectSize} Acres` : p.sqft ? `${p.sqft} sqft` : '--';

  const resConfigs: any[] = Array.isArray(p.residentialConfigs) ? p.residentialConfigs : [];
  const comConfigs: any[] = Array.isArray(p.commercialConfigs)  ? p.commercialConfigs  : [];

  const isResidential = propType === 'residential' || propType === 'both' || p.type === 'residential';
  const isCommercial = propType === 'commercial';
  const possession = (p.residentialConfigs && p.residentialConfigs.length > 0 && p.residentialConfigs[0].possessionDate)
    ? new Date(p.residentialConfigs[0].possessionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
    : 'Ready';

  const resTypologies = resConfigs.length > 0
    ? resConfigs.map((c: any) => String(c.typology || '')).filter(Boolean).join(', ')
    : `${p.bedrooms || '--'} BHK`;
  const resUnitSize = resConfigs.length > 0 ? String(resConfigs[0].unitSize || '--') : String(p.sqft || '--');
  const comTypes    = comConfigs.length > 0
    ? comConfigs.map((c: any) => String(c.commercialType || '')).filter(Boolean).join(', ')
    : String(p.category || '--');
  const comReturn   = comConfigs.length > 0 ? String(comConfigs[0].assuredReturnPct || '--') : '--';

  const resTicket = resConfigs.length > 0 ? (Number(resConfigs[0].ticketSize) || 0) : 0;
  const comTicket = comConfigs.length > 0 ? (Number(comConfigs[0].ticketSize) || 0) : 0;

  let ticketDisplay: string;
  if (propType === 'commercial') {
    ticketDisplay = comTicket > 0 ? `₹ ${Math.round(comTicket / 100000).toLocaleString()}L+` : (p.price || 'On Request');
  } else if (isResidential) {
    ticketDisplay = resTicket > 0 ? `₹ ${Math.round(resTicket / 10000000).toLocaleString()}Cr+` : (p.price || 'On Request');
  } else {
    ticketDisplay = p.price || 'On Request';
  }

  const agentAvatar = String((p.agent && p.agent.avatar) ? p.agent.avatar : 'https://randomuser.me/api/portraits/men/32.jpg');
  const agentName   = String((p.agent && p.agent.name)   ? p.agent.name   : 'Relationship Manager');
  const agentRating = String((p.agent && p.agent.rating) ? p.agent.rating : '4.8');
  const propId      = String(p._id || '');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      <div className="container mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <a href="/" className="hover:text-orange-500">Home</a>
          <span>/</span>
          <a href="/search" className="hover:text-orange-500">{isResidential ? 'Residential' : 'Commercial'}</a>
          <span>/</span>
          <span className="text-[#0a1628] font-bold">{title}</span>
        </nav>

        {/* Hero Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
          <div className="lg:col-span-3 h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden relative group">
            <img
              src={heroImage}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt={title}
            />
            {status && (
              <div className="absolute top-6 left-6 bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                {status}
              </div>
            )}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
              <div className="flex gap-4">
                <button className="bg-white/20 hover:bg-white text-white hover:text-[#0a1628] p-3 rounded-full transition-all">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="bg-white/20 hover:bg-white text-white hover:text-[#0a1628] p-3 rounded-full transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <div className="text-white text-sm font-bold bg-[#0a1628]/40 px-5 py-2.5 rounded-full border border-white/10">
                {allImgs.length} Photo{allImgs.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-4">
            <div className="flex-1 rounded-[2rem] bg-gray-50 flex flex-col items-center justify-center p-8 border border-gray-100 group hover:border-orange-200 transition-colors">
              <Shield className="w-10 h-10 text-orange-500 mb-4" />
              <h4 className="font-bold text-center text-[#0a1628]">Verified <br/>Listing</h4>
            </div>
            <div className="flex-1 rounded-[2rem] bg-[#0a1628] flex flex-col items-center justify-center p-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-orange-500/10 scale-0 group-hover:scale-100 transition-transform rounded-full blur-3xl"></div>
              <div className="relative z-10 text-white font-bold text-lg text-center mb-1">
                {isCommercial ? '8.5%' : (possession || 'Ready')}
              </div>
              <div className="relative z-10 text-blue-200 text-xs text-center">
                {isCommercial ? 'Avg. Rental Yield' : 'Possession Date'}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            {/* Header */}
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{status}</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-400 text-sm font-medium flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {propType}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a1628] mb-6 leading-tight">
                {title}
              </h1>
              <div className="flex items-center text-lg text-gray-500 gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                {locationStr}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-gray-100">
              <div className="space-y-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Project Size</p>
                <p className="text-[#0a1628] font-bold text-lg">{projectSize}</p>
              </div>
              {isResidential ? (
                <>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Configurations</p>
                    <p className="text-[#0a1628] font-bold text-lg">{resTypologies}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Unit Size</p>
                    <p className="text-[#0a1628] font-bold text-lg">{resUnitSize} sqft</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Com. Types</p>
                    <p className="text-[#0a1628] font-bold text-lg">{comTypes}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Assured Return</p>
                    <p className="text-[#0a1628] font-bold text-lg">{comReturn}%</p>
                  </div>
                </>
              )}
              <div className="space-y-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Price</p>
                <p className="text-[#0a1628] font-bold text-lg">{ticketDisplay}</p>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#0a1628]">Overview</h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                Setting new benchmarks in luxury living, {title} offers an unparalleled lifestyle in the heart of {city || 'India'}.
                Designed by award-winning architects, this {status} development combines contemporary aesthetics with world-class amenities.
                Whether you&apos;re looking for an investment or a home for your family, this project provides exceptional value and long-term appreciation potential.
              </p>
            </div>

            {/* Amenities */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-[#0a1628]">Key Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {['Infinity Pool', 'Private Gym', '24/7 Security', 'Concierge Service', 'Garden Lounge', 'Automated Parking'].map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-gray-50 p-5 rounded-3xl border border-gray-100 group hover:border-orange-200 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-[#0a1628] text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              {/* Pricing Card */}
              <div className="bg-[#0a1628] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 space-y-8">
                  <div>
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3">Starting Ticket Size</p>
                    <div className="text-5xl font-bold mb-2">{ticketDisplay}</div>
                    <p className="text-blue-300 text-sm italic">inclusive of all taxes &amp; parking</p>
                  </div>
                  <div className="space-y-4">
                    <LeadForm propertyId={propId} propertyTitle={title} />
                    <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white py-5 rounded-full font-bold text-lg transition-all">
                      Download Brochure
                    </button>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <Info className="w-5 h-5 text-blue-300" />
                    <p className="text-xs text-blue-200 font-medium leading-relaxed">
                      Our expert consultants are available for a private site visit this weekend.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agent Card */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-lg">
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative">
                    <img src={agentAvatar} className="w-16 h-16 rounded-3xl object-cover ring-4 ring-gray-50" alt={agentName} />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-4 border-white"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a1628]">{agentName}</h4>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                      <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                      {agentRating} Rated Expert
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 leading-relaxed italic">&quot;Specializing in luxury portfolios and commercial high-yield investments for over 10 years.&quot;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white pt-24 pb-12 border-t border-gray-100 container mx-auto px-6 md:px-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#0a1628] mb-4">Digital Broker</h2>
          <p className="text-gray-500 text-sm mb-12">Luxury Real Estate Solutions &amp; Commercial Investments</p>
          <div className="text-center text-xs text-gray-400 pt-8 border-t border-gray-50">
            &copy; 2024 Digital Broker. RERA: {rera}
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
