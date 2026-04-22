import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0a1628] pt-24 pb-12 text-left w-full border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1">
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">Digital Broker</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
              Your premier digital partner for high-yield real estate investments and luxury living solutions across Delhi NCR.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2.5 bg-white/5 rounded-xl hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z" /></svg>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-xl hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.linkedin.com/company/113533925/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-xl hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-[10px] tracking-[0.2em]">Company</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <li><a href="/about" className="hover:text-orange-500 transition-colors">About Us</a></li>
              <li><a href="/careers" className="hover:text-orange-500 transition-colors">Careers</a></li>
              <li><a href="/support" className="hover:text-orange-500 transition-colors">Support</a></li>
              <li><a href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-[10px] tracking-[0.2em]">Our Locations</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <li><a href="/search?q=Noida" className="hover:text-orange-500 transition-colors">Noida</a></li>
              <li><a href="/search?q=Greater Noida" className="hover:text-orange-500 transition-colors">Greater Noida</a></li>
              <li><a href="/search?q=Noida Extension" className="hover:text-orange-500 transition-colors">Noida Extension</a></li>
              <li><a href="/yamuna-expressway" className="hover:text-orange-500 transition-colors">Yamuna Expressway</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-[10px] tracking-[0.2em]">Office Hub</h4>
            <div className="space-y-6">
              <p className="text-xs text-gray-400 leading-relaxed font-bold">
                924, Tower B, Bhutani Alphathum, <br />
                Sector 90, Noida, UP 201305
              </p>
              <div className="space-y-4">
                <a href="mailto:sales@digitalbroker.in" className="block group">
                  <span className="text-orange-500 font-bold text-[9px] uppercase tracking-widest block mb-1">Corporate Email</span>
                  <span className="text-xs text-gray-400 group-hover:text-white transition-colors">sales@digitalbroker.in</span>
                </a>
                <a href="https://wa.me/919217976577" target="_blank" rel="noopener noreferrer" className="block group">
                  <span className="text-orange-500 font-bold text-[9px] uppercase tracking-widest block mb-1 font-black">Direct WhatsApp</span>
                  <span className="text-xs text-gray-400 group-hover:text-white transition-colors tracking-tight">+91 92179 76577</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <p className="text-[10px] text-gray-500 font-medium leading-relaxed max-w-xl">
              <span className="text-gray-400 font-bold uppercase tracking-widest block mb-1">Compliance Disclaimer</span>
              UP RERA Registration No: UPRERAAGT22341. All project details should be verified before any commercial or residential transaction.
            </p>
          </div>
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Digital Broker. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
