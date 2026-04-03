"use client";
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2670&auto=format&fit=crop"
          alt="Luxury Real Estate Building"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center flex-1 px-6 md:px-12 pt-28 pb-16">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-7 animate-fade-in-up">
          <div className="w-8 h-px bg-orange-500"></div>
          <span className="text-orange-500 font-bold tracking-[0.3em] uppercase text-[11px]">Digital Broker · Private Office</span>
          <div className="w-8 h-px bg-orange-500"></div>
        </div>

        {/* Display Headline */}
        <h1 className="animate-fade-in-up animation-delay-200 mb-4" style={{ lineHeight: '0.88' }}>
          <span className="block text-white uppercase" style={{ fontSize: 'clamp(3.5rem, 10vw, 9.5rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
            Find Your
          </span>
          <span className="block text-orange-500 uppercase" style={{ fontSize: 'clamp(3.5rem, 10vw, 9.5rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
            Dream Home
          </span>
          <span className="block text-white uppercase mt-2" style={{ fontSize: 'clamp(1rem, 3vw, 2.5rem)', fontWeight: 300, letterSpacing: '0.3em' }}>
            In A Class Of Its Own
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-gray-300 max-w-xl mx-auto text-base font-light tracking-wide leading-relaxed animate-fade-in-up animation-delay-400">
          Exclusive portfolio of ultra-luxury residences, penthouses & commercial investments for the discerning elite.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3.5 rounded-full font-bold tracking-widest text-[11px] uppercase transition-all hover:scale-105 hover:shadow-[0_15px_40px_rgba(249,115,22,0.5)]">
            Request Private Viewing
          </button>
          <button className="border border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-[#0a1628] px-10 py-3.5 rounded-full font-bold tracking-widest text-[11px] uppercase transition-all">
            Explore The Collection
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 flex items-center gap-10 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
          {[['500+', 'Properties'], ['₹2K Cr+', 'Transactions'], ['0%', 'Brokerage']].map(([num, label], i) => (
            <React.Fragment key={label}>
              {i > 0 && <div className="w-px h-8 bg-white/20"></div>}
              <div className="text-center">
                <p className="text-white font-black text-2xl">{num}</p>
                <p className="text-gray-400 text-[10px] tracking-widest uppercase mt-0.5">{label}</p>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* ── SEARCH BAR ── */}
        <div className="w-full max-w-5xl mx-auto mt-10 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
          <div className="flex justify-center space-x-3 mb-4">
            <button className="px-9 py-2.5 bg-white text-[#0a1628] rounded-full text-sm font-bold shadow-lg transition-all hover:scale-105">
              Residential
            </button>
            <button className="px-9 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-full text-sm font-bold backdrop-blur-md transition-all hover:scale-105 border border-white/20">
              Commercial
            </button>
          </div>

          <div className="bg-white rounded-[100px] shadow-[0_25px_60px_rgba(0,0,0,0.35)] p-2 flex flex-col md:flex-row items-center w-full">
            <div className="flex-1 flex flex-col px-7 py-3 border-b md:border-b-0 md:border-r border-gray-100 w-full text-left group">
              <span className="text-[10px] font-black text-[#0a1628] mb-1 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors">Where</span>
              <input type="text" placeholder="Address, City or Zip" className="w-full outline-none text-gray-400 bg-transparent placeholder-gray-300 text-sm" />
            </div>
            <div className="flex-1 flex flex-col px-7 py-3 border-b md:border-b-0 md:border-r border-gray-100 w-full text-left group">
              <span className="text-[10px] font-black text-[#0a1628] mb-1 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors">Price</span>
              <input type="text" placeholder="Add price" className="w-full outline-none text-gray-400 bg-transparent placeholder-gray-300 text-sm" />
            </div>
            <div className="flex-1 flex flex-col px-7 py-3 border-b md:border-b-0 md:border-r border-gray-100 w-full text-left group">
              <span className="text-[10px] font-black text-[#0a1628] mb-1 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors">Beds & Bath</span>
              <input type="text" placeholder="Add bed & bath" className="w-full outline-none text-gray-400 bg-transparent placeholder-gray-300 text-sm" />
            </div>
            <div className="flex-1 flex flex-col px-7 py-3 w-full text-left group">
              <span className="text-[10px] font-black text-[#0a1628] mb-1 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors">Property Type</span>
              <input type="text" placeholder="Property" className="w-full outline-none text-gray-400 bg-transparent placeholder-gray-300 text-sm" />
            </div>
            <div className="md:ml-2 p-1">
              <button
                onClick={() => router.push('/search')}
                className="w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-[0_10px_30px_rgba(249,115,22,0.5)] active:scale-95"
              >
                <Search className="w-6 h-6 stroke-[2.5px]" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-[10px] font-bold">
            <span className="text-white/30 uppercase tracking-[3px]">Popular</span>
            {['South Mumbai', 'Bandra West', 'Gurgaon Sec 44', 'Whitefield BLR', 'Jubilee Hills'].map(loc => (
              <button key={loc} className="text-white/50 hover:text-orange-500 transition-colors tracking-wider uppercase">{loc}</button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
