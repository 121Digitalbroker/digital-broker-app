"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton';
import MultiRangeSlider from '@/components/MultiRangeSlider';
import { LayoutGrid, Map as MapIcon, List, Search } from 'lucide-react';
import Footer from '@/components/Footer';

const SearchPage = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [filter, setFilter] = useState({ 
    type: 'residential', 
    category: 'All', // Changed from 'Apartments' to 'All'
    q: '',
    minSqft: '12',
    maxSqft: '740',
    minPrice: '500000',
    maxPrice: '1000000000',
    floors: 'All',
    bedrooms: 'All',
    condition: 'All'
  });

  // Initialize filters from URL on first load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setFilter({
        type: params.get('type') || 'residential',
        category: params.get('category') || 'All',
        q: params.get('q') || '',
        minSqft: params.get('minSqft') || '12',
        maxSqft: params.get('maxSqft') || '740',
        minPrice: params.get('minPrice') || '500000',
        maxPrice: params.get('maxPrice') || '1000000000',
        floors: params.get('floors') || 'All',
        bedrooms: params.get('bedrooms') || 'All',
        condition: params.get('condition') || 'All'
      });
      setIsInitialized(true);
    }
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const qParams = new URLSearchParams({
        type: filter.type,
        q: filter.q,
        category: filter.category,
        minSqft: filter.minSqft,
        maxSqft: filter.maxSqft,
        minPrice: filter.minPrice,
        maxPrice: filter.maxPrice,
        floors: filter.floors,
        bedrooms: filter.bedrooms,
        condition: filter.condition
      }).toString();
      
      const res = await fetch(`/api/properties?${qParams}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProperties(data);
      } else {
        console.error("API returned non-array data:", data);
        setProperties([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stableFilter = useMemo(() => filter, [filter.type, filter.category, filter.q, filter.minSqft, filter.maxSqft, filter.minPrice, filter.maxPrice, filter.floors, filter.bedrooms, filter.condition]);

  useEffect(() => {
    if (isInitialized) {
      fetchProperties();
    }
  }, [stableFilter, isInitialized]);

  // Format price helper
  const formatRupees = (val: string | number) => {
    const num = Number(val);
    if (!num) return '₹0';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pb-20 overflow-x-hidden pt-28">
      <Navbar />

      {/* Filters Section Header removed per request */}

      <main className="container mx-auto px-6 md:px-12">
        
        {/* Top Control Bar: Type, Categories, View Modes */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 mb-8 mt-4 border-b border-gray-100 pb-6">
          
          <div className="flex items-center gap-8 w-full xl:w-auto overflow-x-auto scrollbar-hide">
            {/* Residential / Commercial Toggle & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
              <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100 flex-shrink-0">
                <button 
                  onClick={() => setFilter({...filter, type: 'residential'})}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${filter.type === 'residential' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >Residential</button>
                <button 
                  onClick={() => setFilter({...filter, type: 'commercial'})}
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${filter.type === 'commercial' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >Commercial</button>
              </div>

              {/* New Search Bar */}
              <div className="flex-1 w-full max-w-md relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  value={filter.q}
                  onChange={(e) => setFilter({...filter, q: e.target.value})}
                  placeholder="Search by project or location..." 
                  className="w-full bg-gray-50 border border-gray-100 rounded-full py-2.5 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                />
              </div>
            </div>

          </div>

          {/* View Modes */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-400 shrink-0">
             <button className="flex items-center gap-2 text-orange-500"><LayoutGrid className="w-4 h-4"/> Grid</button>
             <button className="flex items-center gap-2 hover:text-gray-600"><MapIcon className="w-4 h-4"/> Map</button>
             <button className="flex items-center gap-2 hover:text-gray-600"><List className="w-4 h-4"/> List</button>
          </div>
        </div>

        {/* Detailed Filters Row */}
        <div className="flex flex-wrap items-end gap-x-12 gap-y-8 mb-12 text-[11px] font-medium text-gray-400 px-2 lg:px-0">
            {/* Square Area */}
            <div className="flex-1 min-w-[200px]">
               <div className="flex justify-between items-center mb-3">
                 <p>Square:</p>
                 <span className="text-[#0a1628] font-bold text-xs">{filter.minSqft} - {filter.maxSqft} m²</span>
               </div>
               <MultiRangeSlider
                 min={0}
                 max={2000}
                 step={50}
                 initialMin={Number(filter.minSqft)}
                 initialMax={Number(filter.maxSqft)}
                 onChange={({ min, max }) => setFilter({...filter, minSqft: String(min), maxSqft: String(max)})}
               />
            </div>

            {/* Price Range */}
            <div className="flex-1 min-w-[200px]">
               <div className="flex justify-between items-center mb-3">
                 <p>Price:</p>
                 <span className="text-[#0a1628] font-bold text-xs">{formatRupees(filter.minPrice)} - {formatRupees(filter.maxPrice)}</span>
               </div>
               <MultiRangeSlider
                 min={0}
                 max={1000000000}
                 step={1000000}
                 initialMin={Number(filter.minPrice)}
                 initialMax={Number(filter.maxPrice)}
                 onChange={({ min, max }) => setFilter({...filter, minPrice: String(min), maxPrice: String(max)})}
               />
            </div>

            {/* Qnty of floors */}
            <div>
               <p className="mb-2.5">Qnty of floors:</p>
               <div className="flex gap-1">
                  {['All', '1-5', '5-9', '9-16', '17-26', '26+'].map((f) => (
                    <button 
                      key={f} 
                      onClick={() => setFilter({...filter, floors: f})}
                      className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-colors ${filter.floors === f ? 'bg-[#0a1628] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {f}
                    </button>
                  ))}
               </div>
            </div>

            {/* Qnty of bedrooms */}
            <div>
               <p className="mb-2.5">Qnty of bedrooms:</p>
               <div className="flex gap-1">
                  {['All', '1', '2', '3', '4+'].map((f) => (
                    <button 
                      key={f} 
                      onClick={() => setFilter({...filter, bedrooms: f})}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-colors ${filter.bedrooms === f ? 'bg-[#0a1628] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {f}
                    </button>
                  ))}
               </div>
            </div>
            
            {/* House condition */}
            <div className="hidden 2xl:block">
               <p className="mb-2.5">House condition:</p>
               <div className="flex gap-1">
                  {['All', 'Rough repair', 'Without repair', 'With repair'].map((f) => (
                    <button 
                      key={f} 
                      onClick={() => setFilter({...filter, condition: f})}
                      className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-colors ${filter.condition === f ? 'bg-[#0a1628] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {f}
                    </button>
                  ))}
               </div>
            </div>
        </div>

        {/* Property Grid Array */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
             Array(8).fill(0).map((_, i) => <PropertyCardSkeleton key={i} />)
          ) : properties.length === 0 ? (
             <div className="col-span-12 text-center text-gray-500 py-12">No properties found matching your criteria.</div>
          ) : (
            properties.map((prop: any) => <PropertyCard key={prop._id} property={prop} />)
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
