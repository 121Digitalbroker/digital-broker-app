import React from 'react';
import Navbar from '@/components/Navbar';
import YamunaClientWrapper from './YamunaClientWrapper';
import ChatWidget from '@/components/ChatWidget';
import { Home } from 'lucide-react';

async function getYamunaProperties() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/properties`,
    { cache: 'no-store' }
  );
  if (!res.ok) return [];
  const all = await res.json();
  // Only Greater Noida / Noida, no promoted cards
  return all.filter(
    (p: any) =>
      ['Greater Noida', 'Noida'].includes(p.city) && !p.isPromoted
  );
}

export default async function YamunaExpresswayPage() {
  const properties = await getYamunaProperties();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      <YamunaClientWrapper properties={properties} />

      {/* Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-100 container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-left">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-[#0a1628] mb-6">Digital Broker</h3>
            <p className="text-gray-500 text-sm mb-6">
              Curating the future of residential and commercial excellence.
            </p>
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
              <li><a href="/about" className="hover:text-orange-500">About Us</a></li>
              <li><a href="/careers" className="hover:text-orange-500">Careers</a></li>
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
