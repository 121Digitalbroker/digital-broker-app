"use client";
import React, { useState, useEffect } from 'react';
import { Search, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const forceSolid = !isHome || scrolled;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // Check admin auth
    const auth = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;
    const currentRole = typeof window !== 'undefined' ? localStorage.getItem('admin_role') : null;
    setIsAdmin(auth === 'true');
    setRole(currentRole || '');

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_role');
    setIsAdmin(false);
    setRole('');
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/search' },
    { name: 'Yamuna Expressway', href: '/yamuna-expressway' },
    { name: 'About', href: '/about' },
    { name: 'Support', href: '/support' },
    { name: 'Contact', href: '/contact', special: true },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${forceSolid ? 'bg-white shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Left Side: Logo & Main Nav */}
          <div className="flex items-center gap-12 text-left">
            <Link href="/" className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${forceSolid ? 'text-[#0a1628]' : 'text-white'}`}>
              Digital<span className="text-orange-500">Broker</span>
            </Link>
            
            <div className={`hidden lg:flex items-center space-x-8 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${forceSolid ? 'text-gray-500' : 'text-gray-300'}`}>
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`hover:text-orange-500 transition-colors ${link.special ? 'text-orange-500' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side: Social Icons & Search */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-gray-100/20">
              <a href="#" className={`transition-all hover:scale-110 ${forceSolid ? 'text-gray-400 hover:text-orange-500' : 'text-white/40 hover:text-white'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
              </a>
              <a href="#" className={`transition-all hover:scale-110 ${forceSolid ? 'text-gray-400 hover:text-orange-500' : 'text-white/40 hover:text-white'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className={`transition-all hover:scale-110 ${forceSolid ? 'text-gray-400 hover:text-orange-500' : 'text-white/40 hover:text-white'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className={`transition-all hover:scale-110 ${forceSolid ? 'text-gray-400 hover:text-orange-500' : 'text-white/40 hover:text-white'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/search" className={`p-2 rounded-full cursor-pointer transition-colors ${forceSolid ? 'text-gray-400 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                <Search className="w-5 h-5" />
              </Link>
            
            {/* Mobile Menu Toggle */}
            <div 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-full cursor-pointer transition-colors ${forceSolid ? 'text-[#0a1628] hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            >
              <Menu className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[110] bg-[#0a1628] transition-transform duration-500 flex flex-col justify-center items-center ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-8 right-8 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="flex flex-col items-center space-y-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-2xl font-black uppercase tracking-widest text-white hover:text-orange-500 transition-colors ${link.special ? 'text-orange-500' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
