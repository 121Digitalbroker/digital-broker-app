"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Star, ShieldCheck, CreditCard, Layers, Calendar } from 'lucide-react';

const PropertyCard = ({ property }: { property: any }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Field Resolution ──
  const projectName = property.projectName || property.title || 'Untitled Project';
  const developerName = property.developerName || 'Digital Broker';
  const reraNumber = property.reraNumber || 'RERA: PRM/KA/RERA/1251';

  const image = (property.productImages && property.productImages.length > 0)
    ? String(property.productImages[0])
    : (property.images && property.images.length > 0)
      ? String(property.images[0])
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2670&auto=format&fit=crop';

  const location = (property.sector ? `${property.sector}, ` : '') + (property.city || property.location || '');
  const type = property.propertyType || property.type || '';
  const status = property.projectStatus || property.badge;

  // ── Ticket Size / Price ──
  let displayPrice = property.price || '';
  if (!displayPrice && type === 'commercial' && property.commercialConfigs && property.commercialConfigs.length > 0) {
    const t = Number(property.commercialConfigs[0].ticketSize) || 0;
    displayPrice = t > 0 ? `₹${Math.round(t / 100000)}L+` : 'On Request';
  } else if (!displayPrice && property.residentialConfigs && property.residentialConfigs.length > 0) {
    const t = Number(property.residentialConfigs[0].ticketSize) || 0;
    displayPrice = t > 0 ? `₹${(t / 10000000).toFixed(1)}Cr+` : 'On Request';
  }
  if (!displayPrice) displayPrice = 'On Request';

  // ── Secondary Slot (Possession for Resi, ROI for Commi) ──
  const isResidential = type === 'residential' || type === 'both';
  const isCommercial = type === 'commercial';

  // For Commercial: Get Assured Return
  const roi = (property.commercialConfigs && property.commercialConfigs.length > 0 && property.commercialConfigs[0].assuredReturnPct)
    ? property.commercialConfigs[0].assuredReturnPct
    : (mounted ? 12 : 12); // Fallback mock ROI only for commi

  // ── Generate SEO Slug ──
  const slugBase = `${projectName}-${location}`.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with hyphen
    .replace(/(^-|-$)+/g, ''); // remove leading/trailing hyphens
  const propertyUrl = `/properties/${property.slug || `${slugBase}-${property._id}`}`;

  return (
    <div className="bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group hover:-translate-y-3 flex flex-col h-full">
      {/* Top Image Section with Badges */}
      <Link href={propertyUrl} className="relative h-[220px] overflow-hidden rounded-[2.2rem] block mb-5">
        <img
          src={image}
          alt={projectName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        {status && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest">
            {status}
          </div>
        )}
        {type && (
          <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            {type}
          </div>
        )}
      </Link>

      <div className="px-2 flex flex-col flex-1 pb-2">
        {/* Developer Info - Prominent */}
        <div className="flex items-center gap-3 mb-2">
          {property.developerLogo ? (
            <img src={property.developerLogo} alt={developerName} className="h-8 max-w-[80px] object-contain" />
          ) : (
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Developer</span>
          )}
          <span className="text-lg font-black text-[#0a1628] uppercase tracking-tight leading-tight line-clamp-1">{developerName}</span>
        </div>

        {/* Title */}
        <Link href={propertyUrl}>
          <h3 className="font-semibold text-sm text-gray-500 mb-3 group-hover:text-orange-500 transition-colors line-clamp-1 leading-tight">
            {projectName}
          </h3>
        </Link>

        {/* RERA */}
        <div className="flex items-center text-[11px] font-semibold text-gray-400 mb-5 bg-gray-50 w-fit px-3 py-1 rounded-lg border border-gray-100">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500 mr-2" />
          {reraNumber}
        </div>

        {/* Stats Grid - CONDITIONAL ROI */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100 group-hover:border-orange-100 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Ticket Size</span>
            </div>
            <div className="text-[13px] font-black text-[#0a1628]">{displayPrice}</div>
          </div>

          <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100 group-hover:border-orange-100 transition-colors">
            {isCommercial ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Assured RTN</span>
                </div>
                <div className="text-[13px] font-black text-[#0a1628]">{roi}% <span className="text-[10px] text-green-500 font-bold">ROI</span></div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Status</span>
                </div>
                <div className="text-[13px] font-black text-[#0a1628] truncate">{property.projectStatus || 'Under Construction'}</div>
              </>
            )}
          </div>
        </div>

        {/* Location & Furnishing */}
        <div className="flex flex-col gap-3 mb-6">
          {location && (
            <div className="flex items-start text-xs font-semibold text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-orange-400 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {property.furnishingType && (
              <div className="flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">
                {property.furnishingType}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-[#0a1628]">Premium Listing</span>
              <div className="flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-orange-500 text-orange-500" />
                <span className="text-[9px] font-bold text-gray-500">4.9 Rated</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/916375232264?text=Hi, I am interested in ${projectName} at ${location}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white p-2.5 rounded-2xl hover:scale-110 transition-transform shadow-lg shadow-[#25D366]/20"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
            <Link
              href={propertyUrl}
              className="bg-[#0a1628] text-white p-2.5 rounded-2xl hover:bg-orange-500 transition-colors shadow-lg"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
