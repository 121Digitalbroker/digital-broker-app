import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0a1628] pt-24 pb-12 text-left w-full border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-white mb-6">Digital Broker</h3>
            <p className="text-gray-400 text-sm mb-6">Curating the future of residential and commercial excellence.</p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z" /></svg>
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-orange-500 hover:text-white transition-all text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-orange-500 transition-colors">About Us</a></li>
              <li><a href="/careers" className="hover:text-orange-500 transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Home Loans</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Legal Check</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <div className="space-y-6">
              <p className="text-sm text-gray-400 leading-relaxed">
                924, Tower B, Bhutani Alphathum, <br />
                Sector 90, Noida (U.P) 201305
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                   <span className="text-orange-500 font-bold block mb-1">Email Us</span>
                   devashish@vantagerealtors.in
                </p>
                <p className="text-sm text-gray-400 pt-2 font-bold">
                   <span className="text-orange-500 font-bold block mb-1 uppercase tracking-tighter">Call Us</span>
                   +91 99999 99999
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 pt-8 border-t border-white/5">
          &copy; {new Date().getFullYear()} Digital Broker. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
