import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Target, Trophy, Building2 } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0a1628]">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Luxury Skyscraper" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-4xl lg:text-7xl font-black text-white uppercase tracking-tight mb-6">
            Redefining <span className="text-orange-500">Luxury</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-400 font-light leading-relaxed">
            Digital Broker is the premier destination for ultra-luxury residential and commercial real estate, catering exclusively to the world's most discerning elite.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-6">Our Legacy of Excellence</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Founded on the principles of discretion, integrity, and unparalleled market expertise, Digital Broker has established itself as the authority in high-end real estate transactions.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our private office provides bespoke advisory services, ensuring our clients receive tailored solutions whether they are acquiring a penthouse in the sky or a trophy commercial asset.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
             <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <Trophy className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="font-bold text-[#0a1628] mb-2">Top 1%</h3>
                <p className="text-sm text-gray-500">Of global class brokerages by volume.</p>
             </div>
             <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 lg:mt-8">
                <Shield className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="font-bold text-[#0a1628] mb-2">Absolute Discretion</h3>
                <p className="text-sm text-gray-500">Privacy is our highest priority.</p>
             </div>
             <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 lg:-mt-8">
                <Target className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="font-bold text-[#0a1628] mb-2">Precision</h3>
                <p className="text-sm text-gray-500">Data-driven market insights.</p>
             </div>
             <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <Building2 className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="font-bold text-[#0a1628] mb-2">Trophy Assets</h3>
                <p className="text-sm text-gray-500">Access to off-market properties.</p>
             </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default AboutPage;
