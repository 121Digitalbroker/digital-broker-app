"use client";
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, MapPin, DollarSign, Home, Maximize2, Layers, TrendingUp } from 'lucide-react';
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

  if (!mounted) return null;

  return (
    <section className="relative w-full flex flex-col">
      {/* Hero Banner Area */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-32 px-6 md:px-12">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/banner%20design%20costume%202nd.jpg"
            alt="Hero Banner"
            className="w-full h-full object-cover animate-ken-burns"
          />
          {/* Gradient overlay removed per user request */}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
          <h1 className="animate-fade-in-up animation-delay-200 mb-4" style={{ lineHeight: '0.88' }}>
            <span className="block text-white uppercase" style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
              Find Your
            </span>
            <span className="block text-orange-500 uppercase" style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
              Dream Home
            </span>
          </h1>

          <p className="mt-6 text-gray-300 max-w-xl mx-auto text-base font-light tracking-wide leading-relaxed animate-fade-in-up animation-delay-400">
            Exclusive portfolio of ultra-luxury residences, penthouses & commercial investments for the discerning elite.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <button
              onClick={() => setShowViewingModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3.5 rounded-full font-bold tracking-widest text-[11px] uppercase transition-all hover:scale-105 hover:shadow-[0_15px_40px_rgba(249,115,22,0.5)]"
            >
              Book Your Appointment
            </button>
          </div>


        </div>

      </div>

      {/* ── OVERLAPPING SEARCH BAR ── */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 md:px-0 -mt-28">
        <PrivateViewingModal
          isOpen={showViewingModal}
          onClose={() => setShowViewingModal(false)}
          properties={properties}
        />
        {/* ── CATEGORY BAR ── */}
        <div className="mb-4 flex justify-center">
          <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-full p-1 flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-[0_10px_25px_rgba(249,115,22,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-white' : 'text-gray-400'}`} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── NEW HORIZONTAL FLOATING BAR ── */}
        <div className="bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)] rounded-[25px] md:rounded-full p-1.5 flex flex-col md:flex-row items-center w-full relative z-30 transition-all duration-500 border border-white/20">

          {/* Location Input */}
          <div className="w-full md:flex-1 flex items-center px-5 py-2.5 cursor-text group">
            <Search className={`w-4 h-4 mr-2.5 transition-colors ${searchQuery ? 'text-orange-500' : 'text-gray-400'}`} />
            <div className="flex-1 w-full text-left">
              <span className="text-[9px] font-black text-[#0a1628] mb-0.5 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors block">Where</span>
              <input
                type="text"
                placeholder="Address, City or Zip"
                className="w-full outline-none text-[#0a1628] bg-transparent placeholder-gray-300 text-[13px] font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-100"></div>

          {/* Type Dropdown */}
          <div
            className="w-full md:w-auto relative px-5 py-2.5 cursor-pointer group hover:bg-gray-50 md:hover:bg-transparent rounded-2xl md:rounded-none border-t md:border-t-0 border-gray-50"
            onMouseEnter={() => setOpenDropdown('type')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <span className="text-[10px] font-black text-[#0a1628] uppercase tracking-[0.1em] block mb-0.5">Property Type</span>
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 whitespace-nowrap group-hover:text-orange-500 transition-colors">
              {activeCategory === 'Commercial'
                ? (commercialType ? commercialType : 'All Types')
                : (bedrooms ? bedrooms : 'All Types')}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'type' ? 'rotate-180 text-orange-500' : ''}`} />
            </div>

            {openDropdown === 'type' && (
              <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 pt-4 w-[340px] z-50 cursor-default animate-fade-in-up pb-10">
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
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-100"></div>

          {/* Budget Dropdown */}
          <div
            className="w-full md:w-auto relative px-6 py-3 cursor-pointer group hover:bg-gray-50 md:hover:bg-transparent rounded-2xl md:rounded-none"
            onMouseEnter={() => setOpenDropdown('budget')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <span className="text-[10px] font-black text-[#0a1628] uppercase tracking-[0.1em] block mb-0.5">Budget</span>
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 whitespace-nowrap group-hover:text-orange-500 transition-colors">
              ₹{priceRange.min} - {priceRange.max}Cr <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'budget' ? 'rotate-180 text-orange-500' : ''}`} />
            </div>

            {openDropdown === 'budget' && (
              <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 pt-4 w-[340px] z-50 cursor-default animate-fade-in-up pb-10">
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
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto p-1 mt-2 md:mt-0 ml-auto">
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
              className="w-full md:w-auto px-10 h-[52px] bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-[0_15px_35px_rgba(249,115,22,0.45)] active:scale-95 gap-3"
            >
              <Search className="w-4 h-4 stroke-[3px]" />
              <span className="font-black tracking-[0.15em] text-[11px] uppercase">Search</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
