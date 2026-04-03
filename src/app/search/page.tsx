"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import MultiRangeSlider from '@/components/MultiRangeSlider';
import { LayoutGrid, Map as MapIcon, List, Search } from 'lucide-react';

const SearchPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ 
    type: 'residential', 
    category: 'Apartments',
    minSqft: '12',
    maxSqft: '740',
    minPrice: '500000',
    maxPrice: '1000000000',
    floors: 'All',
    bedrooms: 'All',
    condition: 'All'
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        type: filter.type,
        category: filter.category,
        minSqft: filter.minSqft,
        maxSqft: filter.maxSqft,
        minPrice: filter.minPrice,
        maxPrice: filter.maxPrice,
        floors: filter.floors,
        bedrooms: filter.bedrooms,
        condition: filter.condition
      }).toString();
      
      const res = await fetch(`/api/properties?${q}`);
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filter]);

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

      {/* Top Search / Header mock */}
      <div className="container mx-auto px-6 md:px-12 mb-8 hidden md:flex items-center gap-6 text-sm text-gray-500 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2"><div className="w-5 h-5 bg-orange-100 text-orange-500 rounded flex items-center justify-center font-bold">H</div></div>
        <span className="font-medium">Properties list</span>
        <span className="font-medium">Analytics</span>
        <span className="text-orange-500 font-bold">What is Horizon?</span>
        <span className="font-medium mr-auto">Tools&Calculators</span>
        
        <div className="bg-gray-50 rounded-lg px-4 py-2 flex items-center gap-3 w-64 border border-gray-100">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Noida, India" className="bg-transparent border-none outline-none text-xs w-full font-medium" />
        </div>
      </div>

      <main className="container mx-auto px-6 md:px-12">
        
        {/* Top Control Bar: Type, Categories, View Modes */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 mb-8 mt-4 border-b border-gray-100 pb-6">
          
          <div className="flex items-center gap-8 w-full xl:w-auto overflow-x-auto scrollbar-hide">
            {/* Residential / Commercial Toggle */}
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

            {/* Categories */}
            <div className="flex items-center gap-6 font-semibold text-[13px] text-gray-400">
              {['All', 'Apartments', 'Private homes', 'Multi-storey building', 'Single rooms', 'Units'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setFilter({...filter, category: cat})}
                    className={`whitespace-nowrap transition-colors ${filter.category === cat ? 'text-orange-500 font-bold bg-orange-50 px-3 py-1.5 rounded-full' : 'hover:text-gray-600'}`}
                  >
                    {cat}
                  </button>
              ))}
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
             Array(8).fill(0).map((_, i) => <div key={i} className="bg-gray-50 rounded-2xl h-[300px] animate-pulse"></div>)
          ) : properties.length === 0 ? (
             <div className="col-span-12 text-center text-gray-500 py-12">No properties found matching your criteria.</div>
          ) : (
            properties.map((prop: any) => <PropertyCard key={prop._id} property={prop} />)
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
