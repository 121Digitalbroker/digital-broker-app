"use client";
import React, { useCallback, useEffect, useState } from 'react';
import YamunaHeroSection from '@/components/YamunaHeroSection';
import YamunaFeaturedProperties from '@/components/YamunaFeaturedProperties';

function mapBedroomsToApi(bedrooms: string | null | undefined): string | null {
  if (!bedrooms || bedrooms === 'Any') return null;
  const m = bedrooms.match(/(\d)/);
  if (m) return m[1];
  if (bedrooms.toLowerCase().includes('5')) return '4+';
  return null;
}

export default function YamunaClientWrapper({ properties, banners }: { properties: any[], banners: any[] }) {
  const [activeCategory, setActiveCategory] = useState('Residential');
  const [searchFilters, setSearchFilters] = useState<any>(null);
  const [listProperties, setListProperties] = useState<any[]>(properties);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    setListProperties(properties);
  }, [properties]);

  const handleSearch = useCallback(
    async (filters: any) => {
      setSearchFilters(filters);
      document.getElementById('yamuna-listings')?.scrollIntoView({ behavior: 'smooth' });

      const q = typeof filters?.q === 'string' ? filters.q.trim() : '';

      if (!q) {
        setListProperties(properties);
        return;
      }

      setSearchLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('yamuna', '1');
        params.set('q', q);
        params.set('type', activeCategory.toLowerCase());
        if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice));
        if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
        const bed = mapBedroomsToApi(filters.bedrooms);
        if (bed) params.set('bedrooms', bed);
        if (filters.commercialType && filters.commercialType !== 'Any') {
          params.set('category', filters.commercialType);
        }

        const res = await fetch(`/api/properties?${params.toString()}`);
        const data = await res.json();
        setListProperties(Array.isArray(data) ? data : []);
      } catch {
        setListProperties(properties);
      } finally {
        setSearchLoading(false);
      }
    },
    [activeCategory, properties]
  );

  return (
    <>
      <YamunaHeroSection 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        onSearch={handleSearch}
        banners={banners}
      />
      <YamunaFeaturedProperties 
        properties={listProperties} 
        activeCategory={activeCategory} 
        searchFilters={searchFilters}
        searchLoading={searchLoading}
      />
    </>
  );
}
