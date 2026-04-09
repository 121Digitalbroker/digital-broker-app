import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Briefcase, Star, Users } from 'lucide-react';

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 animate-fade-in-up">
          <span className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Join The Elite</span>
          <h1 className="text-4xl lg:text-6xl font-black text-[#0a1628] uppercase tracking-tight mb-6">
            Build Your <span className="text-orange-500">Legacy</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">We are always looking for driven, exceptional talent to join our private office and redefine the luxury real estate market.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: <Star />, title: "Premium Brand", desc: "Represent the finest properties and work with ultra-high-net-worth individuals." },
            { icon: <Briefcase />, title: "Unmatched Support", desc: "Access to private marketing, legal, and operational infrastructure." },
            { icon: <Users />, title: "Elite Network", desc: "Collaborate with top industry professionals across the globe." }
          ].map((benefit, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-center">
              <div className="w-14 h-14 mx-auto bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-[#0a1628] text-xl mb-3">{benefit.title}</h3>
              <p className="text-gray-500">{benefit.desc}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-[#0a1628] mb-8">Open Positions</h2>
          <div className="space-y-4">
            {[
              { role: "Senior Luxury Real Estate Advisor", location: "Global / Remote", type: "Full-Time" },
              { role: "Private Office Director", location: "Mumbai / Dubai", type: "Full-Time" },
              { role: "Marketing & PR Specialist", location: "London", type: "Full-Time" }
            ].map((job, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-all group">
                <div>
                  <h3 className="text-xl font-bold text-[#0a1628] mb-2">{job.role}</h3>
                  <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                    <span>{job.location}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-orange-500">{job.type}</span>
                  </div>
                </div>
                <button className="mt-4 md:mt-0 px-6 py-3 bg-gray-50 text-[#0a1628] font-bold rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors flex items-center gap-2">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CareersPage;
