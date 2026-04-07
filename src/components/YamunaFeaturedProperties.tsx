"use client";
import React, { useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Home, Link } from 'lucide-react';

export default function YamunaFeaturedProperties({ properties, activeCategory = 'Residential' }: { properties: any[], activeCategory?: string }) {

  // Filter based on selected category + 'both'
  const filterCat = activeCategory.toLowerCase();
  const filteredProperties = properties.filter((p: any) => 
    p.propertyType === filterCat || p.propertyType === 'both'
  );

  return (
    <section id="yamuna-listings" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 border-b border-gray-200 pb-6">
          <div className="animate-fade-in-up text-center md:text-left">
            <p className="text-sm font-bold text-orange-500 tracking-widest uppercase mb-2">
              Yamuna Expressway Corridor
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a1628] uppercase tracking-tight">
              Featured Properties
            </h2>
          </div>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up">
            {filteredProperties.map((prop: any) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in-up">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-[#0a1628] mb-2 uppercase tracking-wide">
              No {activeCategory} Properties Found
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              We're adding new Yamuna Expressway properties regularly. Check back soon or view all properties.
            </p>
            <a href="/search" className="inline-block px-8 py-3 bg-orange-500 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors">
              View All
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
