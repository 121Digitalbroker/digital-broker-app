"use client";
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, MapPin, DollarSign, Home, Maximize2, Layers, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiRangeSlider from './MultiRangeSlider';

const slides = [
  {
    image: "/uploads/airport.jpg",
    title: "India's Biggest Airport"
  },
  {
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2670&auto=format&fit=crop",
    title: "India's Biggest Multi Modal Transport Hub"
  },
  {
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2670&auto=format&fit=crop",
    title: "India's Most Innovative Hi-Tech City Film City"
  },
  {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
    title: "India's Biggest Hub for Upcoming SemiConductor Industries"
  },
  {
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2670&auto=format&fit=crop",
    title: "India's Biggest Education Hub"
  },
  {
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2670&auto=format&fit=crop",
    title: "On India's Premium Greenfield Expressway"
  }
];

const YamunaHeroSection = ({ activeCategory = 'Residential', setActiveCategory = (c: string) => { }, onSearch }: { activeCategory?: string, setActiveCategory?: (c: string) => void, onSearch?: (filters: any) => void }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState(slides);

  // Search bar states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 1, max: 100 });
  const [areaRange, setAreaRange] = useState({ min: 500, max: 10000 });
  const [floors, setFloors] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [commercialType, setCommercialType] = useState<string | null>(null);

  const categories = [
    { id: 'Residential', icon: Home, label: 'Residential' },
    { id: 'Commercial', icon: Layers, label: 'Commercial' },
  ];

  useEffect(() => {
    setMounted(true);

    // Fetch dynamic banners
    fetch('/api/yamuna-banners', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setHeroSlides(data);
        }
      })
      .catch(err => console.error('Error fetching banners:', err));

    // Cycle every 5 seconds
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  if (!mounted) return null;

  return (
    <section className="relative w-full flex flex-col">
      {/* Hero Banner Area */}
      <div className="relative w-full min-h-[80vh] flex flex-col items-center justify-start overflow-hidden pt-2 pb-20 px-6 md:px-12 bg-black">
        {/* Background Images Crossfade */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: currentSlide === index ? 1 : 0 }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover ${currentSlide === index ? 'animate-ken-burns' : ''}`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black/80"></div>
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center min-h-[65vh] justify-start text-center w-full max-w-6xl pt-4 md:pt-14">
          
          {/* ── CATEGORY & SEARCH OVERLAY (COMPACT & TOP) ── */}
          <div className="w-full max-w-4xl px-4 md:px-0 flex flex-col items-center gap-4 animate-fade-in-up animation-delay-200 mb-8 mt-4 md:mt-0 relative z-50">
            
            {/* Category Toggle - Smaller */}
            <div className="bg-[#0a1628]/40 backdrop-blur-xl border border-white/5 rounded-full p-1 flex items-center shadow-2xl scale-95 md:scale-100">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 md:px-8 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${activeCategory === cat.id
                    ? 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.4)] scale-105'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Floating Search Bar - Compact Width & Height */}
            <div className="bg-white shadow-[0_15px_35px_rgba(0,0,0,0.12)] rounded-[25px] md:rounded-full p-1.5 flex flex-col md:flex-row items-center w-full relative transition-all duration-500 min-h-[60px]">
              
              {/* Location Input */}
              <div className="w-full md:flex-1 flex items-center px-5 py-3 md:py-2 cursor-text group text-left">
                <Search className={`w-4 h-4 mr-3 transition-colors ${searchQuery ? 'text-orange-500' : 'text-gray-400'}`} />
                <div className="flex-1 w-full">
                  <span className="text-[8px] font-black text-[#0a1628]/30 mb-0 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors block">Location</span>
                  <input
                    type="text"
                    placeholder="Search area..."
                    className="w-full outline-none text-[#0a1628] bg-transparent placeholder-gray-300 text-xs font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="hidden md:block w-px h-8 bg-gray-100"></div>

              {/* Type Dropdown */}
              <div
                className="w-full md:w-auto relative px-5 py-3 md:py-2 cursor-pointer group hover:bg-gray-50 md:hover:bg-transparent rounded-2xl md:rounded-none border-t border-gray-50 md:border-none text-left"
                onMouseEnter={() => setOpenDropdown('type')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <span className="text-[8px] font-black text-[#0a1628]/30 uppercase tracking-widest block mb-0 whitespace-nowrap">Property Type</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0a1628] whitespace-nowrap">
                  {activeCategory === 'Commercial'
                    ? (commercialType ? commercialType : 'All Types')
                    : (bedrooms ? bedrooms : 'All Types')}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'type' ? 'rotate-180 text-orange-500' : 'text-gray-400'}`} />
                </div>

                {openDropdown === 'type' && (
                  <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 pt-4 w-[340px] z-50 animate-fade-in-up">
                    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-6 text-left">
                      {activeCategory === 'Residential' ? (
                        <div className="space-y-4">
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-[#0a1628] mb-3 block">Configuration</span>
                            <div className="flex flex-wrap gap-2">
                              {['Any', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+'].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => setBedrooms(option === 'Any' ? null : option)}
                                  className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${bedrooms === option || (bedrooms === null && option === 'Any') ? 'bg-[#0a1628] text-white border-[#0a1628]' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-gray-50">
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
                          <span className="text-[11px] font-black uppercase tracking-widest text-[#0a1628] mb-3 block">Commercial Categories</span>
                          <div className="flex flex-wrap gap-2">
                            {['Any', 'Office Space', 'Shop/Showroom', 'Land', 'Warehouse', 'Industrial'].map((option) => (
                              <button
                                key={option}
                                onClick={() => setCommercialType(option === 'Any' ? null : option)}
                                className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${commercialType === option || (commercialType === null && option === 'Any') ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
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
                className="w-full md:w-auto relative px-5 py-3 md:py-2 cursor-pointer group hover:bg-gray-50 md:hover:bg-transparent rounded-2xl md:rounded-none border-t border-gray-50 md:border-none text-left"
                onMouseEnter={() => setOpenDropdown('budget')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <span className="text-[9px] font-black text-[#0a1628]/40 uppercase tracking-widest block mb-0.5">Budget</span>
                <div className="flex items-center gap-2 text-sm font-bold text-[#0a1628] whitespace-nowrap">
                  ₹{priceRange.min} - {priceRange.max}Cr
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'budget' ? 'rotate-180 text-orange-500' : 'text-gray-400'}`} />
                </div>

                {openDropdown === 'budget' && (
                  <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 pt-4 w-[340px] z-50 animate-fade-in-up">
                    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-6 text-left">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Price Range</span>
                        <span className="text-xs font-black text-orange-500">₹{priceRange.min}-{priceRange.max}Cr</span>
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
                    </div>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <div className="w-full md:w-auto ml-auto px-1 mt-2 md:mt-0 pb-1 md:pb-0">
                <button
                  onClick={() => {
                    if (onSearch) {
                      onSearch({
                        q: searchQuery,
                        minPrice: priceRange.min * 10000000,
                        maxPrice: priceRange.max * 10000000,
                        bedrooms: activeCategory === 'Residential' && bedrooms !== 'Any' ? bedrooms : null,
                        floors: activeCategory === 'Residential' && floors !== 'Any' ? floors : null,
                        commercialType: activeCategory === 'Commercial' && commercialType !== 'Any' ? commercialType : null
                      });
                    } else {
                      const params = new URLSearchParams();
                      if (searchQuery) params.set('q', searchQuery);
                      params.set('type', activeCategory.toLowerCase());
                      params.set('minPrice', String(priceRange.min * 10000000));
                      params.set('maxPrice', String(priceRange.max * 10000000));
                      router.push(`/search?${params.toString()}`);
                    }
                  }}
                  className="w-full md:w-auto px-10 h-[52px] md:h-[56px] bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-[0_10px_30px_rgba(249,115,22,0.4)] active:scale-95 gap-3"
                >
                  <Search className="w-5 h-5 stroke-[2.5px]" />
                  <span className="font-black tracking-widest text-[11px] uppercase">Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── HEADLINE (BELOW SEARCH) ── */}
          <h1 className="animate-fade-in-up animation-delay-400 mb-6 flex flex-col items-center justify-center mt-6 scale-90 md:scale-100" style={{ lineHeight: '1.1' }}>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 lg:gap-8 justify-center mb-4">
              <span className="text-white uppercase" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
                Yamuna
              </span>
              <span className="text-orange-500 uppercase" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
                Expressway
              </span>
            </div>
            <span className="block text-white uppercase italic tracking-[0.3em] font-light mt-2" style={{ fontSize: 'clamp(0.8rem, 2vw, 1.8rem)' }}>
              "The Destination for Future Investors"
            </span>
          </h1>

          <div className="relative h-20 w-full max-w-5xl mx-auto overflow-hidden mt-4 mb-4">
            {heroSlides.map((slide, idx) => (
              <p
                key={idx}
                className="absolute inset-0 text-orange-500 text-xl md:text-3xl font-black tracking-[0.3em] uppercase transition-all duration-1000 flex items-center justify-center pt-2"
                style={{
                  opacity: currentSlide === idx ? 1 : 0,
                  transform: currentSlide === idx ? 'translateY(0)' : (currentSlide > idx ? 'translateY(-15px)' : 'translateY(15px)'),
                  textShadow: '3px 3px 6px rgba(10, 22, 40, 0.8)',
                  WebkitTextStroke: '0.2px rgba(10, 22, 40, 0.5)'
                }}
              >
                {slide.title}
              </p>
            ))}
          </div>

          {/* Dots indicating current sliding background */}
          <div className="mt-8 flex gap-2 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
            {heroSlides.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-orange-500 w-6' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default YamunaHeroSection;
