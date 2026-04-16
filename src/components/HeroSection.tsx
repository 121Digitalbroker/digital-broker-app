"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ArrowUpRight, MapPin, DollarSign, Home, Maximize2, TrendingUp, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiRangeSlider from './MultiRangeSlider';
import PrivateViewingModal from './PrivateViewingModal';

interface Property {
  _id: string;
  projectName?: string;
  title?: string;
  location?: string;
}

interface HeroSectionProps {
  properties?: Property[];
}

const HeroSection = ({ properties = [] }: HeroSectionProps) => {
  const router = useRouter();
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 1, max: 100 });
  const [areaRange, setAreaRange] = useState({ min: 500, max: 10000 });
  const [floors, setFloors] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Residential');
  const [commercialType, setCommercialType] = useState<string | null>(null);
  const [showViewingModal, setShowViewingModal] = useState(false);

  const categories = [
    { id: 'Residential', icon: Home, label: 'Residential' },
    { id: 'Commercial', icon: Layers, label: 'Commercial' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-start pt-30 pb-24 px-6 md:px-12 overflow-hidden bg-[#050b14]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0a1628]/60 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent z-10" />
        <img
          src="/banner%20design%20costume%202nd.jpg"
          alt="Hero Banner"
          className="w-full h-full object-cover animate-ken-burns"
        />
      </div>

      <PrivateViewingModal
        isOpen={showViewingModal}
        onClose={() => setShowViewingModal(false)}
        properties={properties}
      />

      {/* Main Content Wrapper */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center -mt-8">

        {/* ── CATEGORY BAR ── */}
        <div className="mb-4 flex justify-center w-full animate-fade-in-up">
          <div className="bg-[#0a1628]/80 backdrop-blur-md border border-white/10 rounded-full p-1 flex items-center shadow-lg overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 md:px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.4)]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div ref={searchBarRef} className="bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-[25px] md:rounded-full p-1.5 flex flex-col md:flex-row items-center w-full relative z-30 transition-all duration-500 mb-16 animate-fade-in-up animation-delay-200">
          {/* Location Input */}
          <div className="w-full md:flex-1 flex items-center px-6 py-3 cursor-text group">
            <Search className={`w-4 h-4 mr-3 transition-colors ${searchQuery ? 'text-orange-500' : 'text-gray-400'}`} />
            <div className="flex-1 w-full text-left">
              <span className="text-[10px] font-black text-[#0a1628] mb-0.5 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors block">Where</span>
              <input
                type="text"
                placeholder="Address, City or Zip"
                className="w-full outline-none text-[#0a1628] bg-transparent placeholder-gray-400 text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-200/60"></div>

          {/* Type Dropdown */}
          <div
            className="w-full md:w-auto relative px-6 py-3 cursor-pointer group hover:bg-gray-50 md:hover:bg-transparent rounded-2xl md:rounded-none border-t md:border-t-0 border-gray-50 flex-1 md:flex-none"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(openDropdown === 'type' ? null : 'type');
            }}
          >
            <span className="text-[10px] font-black text-[#0a1628] uppercase tracking-[0.1em] block mb-0.5">Property Type</span>
            <div className="flex items-center justify-between md:justify-start gap-2 text-sm font-semibold text-gray-600 whitespace-nowrap group-hover:text-orange-500 transition-colors">
              {activeCategory === 'Commercial'
                ? (commercialType ? commercialType : 'All Types')
                : (bedrooms ? bedrooms : 'All Types')}
              <ArrowUpRight className={`w-4 h-4 transition-transform ${openDropdown === 'type' ? 'text-orange-500 translate-x-0.5 -translate-y-0.5' : 'text-gray-400'}`} />
            </div>

            {openDropdown === 'type' && (
              <div
                className="absolute top-[120%] left-0 md:left-1/2 md:-translate-x-1/2 pt-2 w-[340px] z-50 cursor-default animate-fade-in-up pb-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-gray-100 p-6">
                  {activeCategory === 'Residential' ? (
                    <div className="space-y-4">
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#0a1628] mb-2 block">Configuration</span>
                      <div className="flex flex-wrap gap-2">
                        {['Any', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+'].map((option) => (
                          <button
                            key={option}
                            onClick={() => setBedrooms(option === 'Any' ? null : option)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${bedrooms === option || (bedrooms === null && option === 'Any') ? 'bg-[#0a1628] text-white border-[#0a1628]' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>

                      <div className="pt-4 mt-2 border-t border-gray-50">
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#0a1628] mb-3 block">Floors</span>
                        <div className="flex flex-wrap gap-2">
                          {['Any', 'G', 'G+1', 'G+2', 'G+3', '4+'].map((option) => (
                            <button
                              key={option}
                              onClick={() => setFloors(option === 'Any' ? null : option)}
                              className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${floors === option || (floors === null && option === 'Any') ? 'bg-[#0a1628] text-white border-[#0a1628]' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <span className="text-[11px] font-black uppercase tracking-widest text-[orange-600] mb-2 block">Commercial Property Types</span>
                      <div className="flex flex-wrap gap-2">
                        {['Any', 'Office Space', 'Shop/Showroom', 'Commercial Land', 'Coworking Space', 'Warehouse', 'Industrial'].map((option) => (
                          <button
                            key={option}
                            onClick={() => setCommercialType(option === 'Any' ? null : option)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${commercialType === option || (commercialType === null && option === 'Any') ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100'}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
                    <button
                      onClick={() => setOpenDropdown(null)}
                      className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-200/60"></div>

          {/* Budget Dropdown */}
          <div
            className="w-full md:w-auto relative px-6 py-3 cursor-pointer group hover:bg-gray-50 md:hover:bg-transparent rounded-2xl md:rounded-none flex-1 md:flex-none"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(openDropdown === 'budget' ? null : 'budget');
            }}
          >
            <span className="text-[10px] font-black text-[#0a1628] uppercase tracking-[0.1em] block mb-0.5">Budget</span>
            <div className="flex items-center justify-between md:justify-start gap-2 text-sm font-semibold text-gray-600 whitespace-nowrap group-hover:text-orange-500 transition-colors">
              ₹{priceRange.min} - {priceRange.max}Cr <ArrowUpRight className={`w-4 h-4 transition-transform ${openDropdown === 'budget' ? 'text-orange-500 translate-x-0.5 -translate-y-0.5' : 'text-gray-400'}`} />
            </div>

            {openDropdown === 'budget' && (
              <div
                className="absolute top-[120%] left-0 md:left-1/2 md:-translate-x-1/2 pt-2 w-[340px] z-50 cursor-default animate-fade-in-up pb-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#0a1628]">Price Range</span>
                    <span className="text-xs font-bold text-orange-500">₹{priceRange.min} - ₹{priceRange.max}Cr</span>
                  </div>
                  <div className="px-2">
                    <MultiRangeSlider
                      min={1}
                      max={100}
                      onChange={({ min, max }) => setPriceRange({ min, max })}
                      initialMin={priceRange.min}
                      initialMax={priceRange.max}
                    />
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#0a1628]">Area Filter</span>
                    <span className="text-xs font-bold text-gray-500">{areaRange.min} - {areaRange.max} sq.ft</span>
                  </div>
                  <div className="px-2 pt-4">
                    <MultiRangeSlider
                      min={500}
                      max={10000}
                      step={100}
                      onChange={({ min, max }) => setAreaRange({ min, max })}
                      initialMin={areaRange.min}
                      initialMax={areaRange.max}
                    />
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
                    <button
                      onClick={() => setOpenDropdown(null)}
                      className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto p-1.5 mt-2 md:mt-0 md:ml-2">
            <button
              onClick={() => {
                const params = new URLSearchParams();
                if (searchQuery) params.set('q', searchQuery);
                params.set('type', activeCategory.toLowerCase());
                params.set('minPrice', String(priceRange.min * 10000000));
                params.set('maxPrice', String(priceRange.max * 10000000));
                params.set('minSqft', String(areaRange.min));
                params.set('maxSqft', String(areaRange.max));
                if (activeCategory === 'Residential') {
                  if (floors && floors !== 'Any') params.set('floors', floors);
                  if (bedrooms && bedrooms !== 'Any') params.set('bedrooms', bedrooms);
                } else {
                  if (commercialType && commercialType !== 'Any') params.set('category', commercialType);
                }
                router.push(`/search?${params.toString()}`);
              }}
              className="w-full md:w-auto px-10 h-[56px] bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-[0_10px_20px_rgba(249,115,22,0.3)] active:scale-95 gap-3"
            >
              <Search className="w-4 h-4 stroke-[3px]" />
              <span className="font-black tracking-[0.1em] text-[12px] uppercase">Search</span>
            </button>
          </div>

        </div>

        {/* ── HERO TEXT CONTENT ── */}
        <h1 className="animate-fade-in-up animation-delay-400 mb-6 text-center w-full" style={{ lineHeight: '0.9' }}>
          <span className="block text-white uppercase drop-shadow-lg" style={{ fontSize: 'clamp(3rem, 10vw, 8.5rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Find Your
          </span>
          <span className="block text-orange-500 uppercase drop-shadow-lg" style={{ fontSize: 'clamp(3rem, 10vw, 8.5rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Dream Home
          </span>
        </h1>

        <p className="mt-4 text-gray-200 max-w-2xl mx-auto text-base md:text-lg font-medium tracking-wide leading-relaxed animate-fade-in-up animation-delay-600 text-center drop-shadow-md">
          Exclusive portfolio of urban, industrial, philanthropies &amp; commercial investment for the discerned taste
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-800">
          <button
            onClick={() => setShowViewingModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full font-black tracking-widest text-xs uppercase transition-all hover:scale-105 shadow-[0_15px_40px_rgba(249,115,22,0.4)]"
          >
            Book Your Appointment
          </button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
