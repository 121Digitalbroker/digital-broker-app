import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl lg:text-6xl font-black text-[#0a1628] uppercase tracking-tight mb-4">
            Get In <span className="text-orange-500">Touch</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">Connect with our private office for exclusive inquiries and bespoke real estate advisory.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <Phone className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-bold text-[#0a1628] mb-1">Direct Line</h3>
              <p className="text-gray-500 mb-4">Call or WhatsApp us anytime.</p>
              <a href="https://wa.me/919217976577" target="_blank" className="font-bold text-[#0a1628] hover:text-orange-500 transition-colors">+91 9217976577</a>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <Mail className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-bold text-[#0a1628] mb-1">Private Desk</h3>
              <p className="text-gray-500 mb-4">For general and press inquiries.</p>
              <a href="mailto:devashish@vantagerealtors.in" className="font-bold text-[#0a1628] hover:text-orange-500 transition-colors">devashish@vantagerealtors.in</a>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <MapPin className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-bold text-[#0a1628] mb-1">Our Office</h3>
              <p className="text-gray-500 mb-4">Visit us by appointment.</p>
              <p className="font-bold text-[#0a1628]">Noida, Uttar Pradesh, India</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Full Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:bg-white transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Email Address</label>
                  <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:bg-white transition-colors" placeholder="john@company.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Subject</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:bg-white transition-colors text-gray-600">
                  <option>Property Inquiry</option>
                  <option>List a Property</option>
                  <option>Press / Media</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Message</label>
                <textarea rows={5} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:bg-white transition-colors resize-none" placeholder="How can we assist you?"></textarea>
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl w-full transition-colors uppercase tracking-widest text-sm">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
