"use client";
import React, { useState } from 'react';
import YamunaHeroSection from '@/components/YamunaHeroSection';
import YamunaFeaturedProperties from '@/components/YamunaFeaturedProperties';

export default function YamunaClientWrapper({ properties, banners }: { properties: any[], banners: any[] }) {
  const [activeCategory, setActiveCategory] = useState('Residential');
  const [searchFilters, setSearchFilters] = useState<any>(null);

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
    document.getElementById('yamuna-listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <YamunaHeroSection 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        onSearch={handleSearch}
        banners={banners}
      />
      <YamunaFeaturedProperties 
        properties={properties} 
        activeCategory={activeCategory} 
        searchFilters={searchFilters}
      />
    </>
  );
}
