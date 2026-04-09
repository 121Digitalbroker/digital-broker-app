import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, HelpCircle, FileText, Settings, ShieldCheck } from 'lucide-react';

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Search Header */}
      <div className="bg-[#0a1628] pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-8">
            How Can We <span className="text-orange-500">Help?</span>
          </h1>
          <div className="relative max-w-2xl mx-auto flex items-center">
            <Search className="absolute left-6 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for answers, guides, or policies..." 
              className="w-full bg-white/10 border border-white/20 text-white rounded-[100px] pl-16 pr-6 py-4 outline-none focus:bg-white/20 focus:border-white/40 transition-all placeholder-gray-400"
            />
            <button className="absolute right-2 bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-orange-600 transition-colors cursor-pointer z-10">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <HelpCircle />, title: "General FAQs", desc: "Common questions about our services." },
            { icon: <FileText />, title: "Buying Guide", desc: "Step-by-step process of acquiring assets." },
            { icon: <Settings />, title: "Account & Dashboard", desc: "Manage your private portal." },
            { icon: <ShieldCheck />, title: "Trust & Safety", desc: "Security and confidentiality policies." }
          ].map((topic, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-4">
                {topic.icon}
              </div>
              <h3 className="font-bold text-[#0a1628] mb-2">{topic.title}</h3>
              <p className="text-sm text-gray-500">{topic.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-20 max-w-3xl mx-auto px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#0a1628] mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
             { q: "How do I schedule a private viewing?", a: "To schedule a private viewing, please contact our private desk or use the 'Request Viewing' button on the specific property listing. Our team will coordinate a completely private tour." },
             { q: "What is the typical brokerage fee?", a: "For our exclusive portfolio, we often operate with specific bespoke fee structures. Please reach out to an advisor for details regarding specific asset classes." },
             { q: "Are all listings publicly available?", a: "No. A significant portion of our ultra-luxury and commercial trophy assets are considered 'Off-Market' and only shared with vetted clients under strict confidentiality." }
          ].map((faq, i) => (
             <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6">
               <h3 className="font-bold text-lg text-[#0a1628] mb-3">{faq.q}</h3>
               <p className="text-gray-500 leading-relaxed text-sm">{faq.a}</p>
             </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SupportPage;
