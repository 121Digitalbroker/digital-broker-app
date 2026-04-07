import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import PropertyCard from '@/components/PropertyCard';
import CommercialAssetCard from '@/components/CommercialAssetCard';
import ChatWidget from '@/components/ChatWidget';
import { ArrowRight, Star, Shield, TrendingUp, Headphones, Percent, CheckCircle, Home, Car, User } from 'lucide-react';

async function getPromotedProperties() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/properties?promoted=true`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

async function getAverageProperties() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/properties`, { cache: 'no-store' });
  if (!res.ok) return [];
  const all = await res.json();
  return all.filter((p: any) => !p.isPromoted && !p.isFeatured && !p.isPreLeased);
}

export default async function HomePage() {
  const promoted = await getPromotedProperties();
  const average = await getAverageProperties();
  const allProperties = [...promoted, ...average];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <Navbar />
      <HeroSection properties={allProperties} />

      {/* Promoted Selection */}
      <section id="promoted" className="pt-32 pb-24 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div className="animate-fade-in-up">
              <p className="text-sm font-bold text-orange-500 tracking-widest uppercase mb-2">Prime Recommendations</p>
            </div>
            <a href="/search" className="text-orange-500 font-bold hover:text-orange-600 transition-colors flex items-center">
              View All Promoted <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up">
            {promoted.length > 0 ? (
              promoted.slice(0, 8).map((prop: any) => <PropertyCard key={prop._id} property={prop} />)
            ) : (
              <p className="text-gray-500 col-span-full text-center py-10">Select properties in Admin to show them here.</p>
            )}
          </div>
        </div>
      </section>

      {/* Average/Regular Listings */}
      <section id="regular" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4">Regular Listings</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Great value properties for every budget and lifestyle across India's top cities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {average.map((prop: any) => <PropertyCard key={prop._id} property={prop} />)}
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-16 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-10">
            {[
              { icon: Percent, label: "0% Brokerage" },
              { icon: CheckCircle, label: "Verified Listings" },
              { icon: Home, label: "Bank Assistance" },
              { icon: Car, label: "Free Site Visits" },
              { icon: User, label: "Expert Advice" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-[#0a1628] group-hover:bg-[#0a1628] group-hover:text-white transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-[#0a1628]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond Real Estate */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="bg-[#0a1628] rounded-[2.5rem] p-10 md:p-16 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse"></div>

            <div className="lg:w-1/2 relative z-10 text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-12">
                Beyond Real Estate <br />— We Build <br />Legacies.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="group transition-all">
                  <div className="flex items-center mb-4">
                    <Star className="w-6 h-6 text-orange-500 mr-3 fill-orange-500" />
                    <h4 className="text-white font-bold text-lg">Best Deals</h4>
                  </div>
                  <p className="text-blue-200 text-sm">Direct developer prices with exclusive pre-launch discounts.</p>
                </div>
                <div className="group transition-all">
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-orange-500 mr-3" />
                    <h4 className="text-white font-bold text-lg">Verified Builders</h4>
                  </div>
                  <p className="text-blue-200 text-sm">Only Grade-A developers with proven track records.</p>
                </div>
                <div className="group transition-all">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="w-6 h-6 text-orange-500 mr-3" />
                    <h4 className="text-white font-bold text-lg">Investment Guidance</h4>
                  </div>
                  <p className="text-blue-200 text-sm">Data-backed advice on capital appreciation.</p>
                </div>
                <div className="group transition-all">
                  <div className="flex items-center mb-4">
                    <Headphones className="w-6 h-6 text-orange-500 mr-3" />
                    <h4 className="text-white font-bold text-lg">End-to-End Support</h4>
                  </div>
                  <p className="text-blue-200 text-sm">From legal check to moving in, we handle it all.</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full relative z-10">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop"
                alt="Business"
                className="rounded-3xl w-full h-auto object-cover shadow-2xl border-4 border-white/5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="bg-gradient-to-r from-[#0a1628] to-[#1a2d4a] rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Unable to find the property of your choice?</h2>
              <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">Our acquisition team finds off-market deals and luxury assets tailored to your requirements.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full font-bold text-lg transition-all animate-float">
                  Request Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white pt-24 pb-12 border-t border-gray-100 container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-left">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-[#0a1628] mb-6">Digital Broker</h3>
            <p className="text-gray-500 text-sm mb-6">Curating the future of residential and commercial excellence.</p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
              </a>
              <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[#0a1628] mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-orange-500">About Us</a></li>
              <li><a href="#" className="hover:text-orange-500">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#0a1628] mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-orange-500">Home Loans</a></li>
              <li><a href="#" className="hover:text-orange-500">Legal Check</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#0a1628] mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <p className="text-sm text-gray-500">BKC, Mumbai, India<br />hello@digitalbroker.tech</p>
          </div>
        </div>
        <div className="text-center text-sm text-gray-400 pt-8 border-t border-gray-50">
          &copy; 2024 Digital Broker. All Rights Reserved.
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
