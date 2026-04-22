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
        <div className="absolute inset-0 opacity-25">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2673&auto=format&fit=crop" className="w-full h-full object-cover" alt="Modern Architecture" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-4xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            About <span className="text-orange-500">DigitalBroker.in</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 font-light leading-relaxed">
            In an era where technology drives every smart decision, DigitalBroker.in is transforming how property is bought and sold in Noida.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Our Vision</h2>
              <p className="text-2xl font-bold text-[#0a1628] leading-tight mb-6">
                Stripping away the inefficiencies of traditional brokerage.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                We are a tech-enabled real estate platform designed to leverage advanced data analytics and a streamlined digital infrastructure. We provide a modern, transparent, out-of-the-box experience for the contemporary investor.
              </p>
            </div>
            
            <div className="p-8 bg-orange-50 rounded-3xl border border-orange-100">
              <h3 className="text-xl font-black text-[#0a1628] mb-4 uppercase tracking-tight">Our Primary Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To offer the most competitive pricing in the market. We achieve this through our innovative <span className="font-bold text-orange-600">slim-brokerage model</span>, reducing overhead costs and passing those direct savings on to our clients.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <p className="text-gray-600 leading-relaxed italic border-l-4 border-orange-500 pl-6 text-xl font-medium">
              "Whether you are looking for a high-end residential apartment or a strategic commercial investment, DigitalBroker.in ensures you get the best deal without the heavy commission burden."
            </p>
            
            <div className="grid grid-cols-1 gap-6">
               <div className="flex gap-6 p-6 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#0a1628] text-white rounded-xl flex items-center justify-center font-black group-hover:bg-orange-500 transition-colors">01</div>
                  <div>
                    <h3 className="font-black text-[#0a1628] uppercase text-xs tracking-widest mb-2">Tech-Driven Broking</h3>
                    <p className="text-sm text-gray-500">A seamless, digital-first approach to finding and securing the best properties in Noida.</p>
                  </div>
               </div>
               <div className="flex gap-6 p-6 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#0a1628] text-white rounded-xl flex items-center justify-center font-black group-hover:bg-orange-500 transition-colors">02</div>
                  <div>
                    <h3 className="font-black text-[#0a1628] uppercase text-xs tracking-widest mb-2">Strategic Consultancy</h3>
                    <p className="text-sm text-gray-500">Data-backed insights into market trends, ensuring your capital is positioned for maximum appreciation.</p>
                  </div>
               </div>
               <div className="flex gap-6 p-6 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#0a1628] text-white rounded-xl flex items-center justify-center font-black group-hover:bg-orange-500 transition-colors">03</div>
                  <div>
                    <h3 className="font-black text-[#0a1628] uppercase text-xs tracking-widest mb-2">Portfolio Management</h3>
                    <p className="text-sm text-gray-500">Professional oversight of your real estate holdings, optimized for consistent performance and high rental yields.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Digital Advantage */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-[#0a1628] rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
                  The Digital <br />
                  <span className="text-orange-500">Advantage</span>
                </h2>
                <p className="text-gray-300 text-lg font-light leading-relaxed">
                  DigitalBroker.in is Noida’s answer to the high costs of traditional real estate. By operating on a slim-brokerage model, we prioritize value and transparency above all else. From residential homes to commercial hubs, our platform connects you to premium opportunities with the lowest transaction costs in the industry.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem]">
                <p className="text-white text-xl font-medium leading-relaxed italic mb-8">
                  "At DigitalBroker.in, we believe that high-quality real estate advice should be accessible and affordable."
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We combine the precision of technology with deep local expertise to deliver a brokerage service that is faster, leaner, and more rewarding for you.
                </p>
                <button className="mt-8 px-10 py-4 bg-orange-500 hover:bg-orange-600 transition-all text-white font-black uppercase text-xs tracking-[0.2em] rounded-full shadow-[0_10px_30px_rgba(249,115,22,0.4)]">
                  Start Your Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default AboutPage;
