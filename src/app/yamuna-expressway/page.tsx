import React from 'react';
import Navbar from '@/components/Navbar';
import YamunaClientWrapper from './YamunaClientWrapper';
import ChatWidget from '@/components/ChatWidget';
import Footer from '@/components/Footer';
import { Home } from 'lucide-react';

async function getYamunaBanners() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/yamuna-banners`,
    { cache: 'no-store' }
  );
  if (!res.ok) return [];
  return res.json();
}

async function getYamunaProperties() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/properties?showOnYamunaExpressway=true`,
    { cache: 'no-store' }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function YamunaExpresswayPage() {
  const properties = await getYamunaProperties();
  const banners = await getYamunaBanners();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      <YamunaClientWrapper properties={properties} banners={banners} />

      <Footer />
      <ChatWidget />
    </div>
  );
}
