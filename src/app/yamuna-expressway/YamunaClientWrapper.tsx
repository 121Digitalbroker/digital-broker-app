"use client";
import React, { useState } from 'react';
import YamunaHeroSection from '@/components/YamunaHeroSection';
import YamunaFeaturedProperties from '@/components/YamunaFeaturedProperties';

export default function YamunaClientWrapper({ properties }: { properties: any[] }) {
  const [activeCategory, setActiveCategory] = useState('Residential');

  return (
    <>
      <YamunaHeroSection activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <YamunaFeaturedProperties properties={properties} activeCategory={activeCategory} />
    </>
  );
}
