"use client";
import React, { useState, useEffect } from 'react';
import { Search, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isTransparentPage = pathname === '/' || pathname === '/yamuna-expressway';
  const forceSolid = !isTransparentPage || scrolled;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUser, setIsUser] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('user_auth') === 'true' : false
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    const syncUserAuth = () => {
      const userAuth = typeof window !== 'undefined' ? localStorage.getItem('user_auth') : null;
      setIsUser(userAuth === 'true');
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', syncUserAuth);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', syncUserAuth);
    };
  }, []);

  const handleUserLogout = () => {
    localStorage.removeItem('user_auth');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_username');
    setIsUser(false);
    window.location.href = '/login';
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/search' },
    { name: 'Yamuna Expressway', href: '/yamuna-expressway' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Support', href: '/support' },
    { name: 'Contact', href: '/contact', special: true },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${forceSolid ? 'bg-[#0a1628] shadow-2xl border-b border-white/5 py-2.5' : 'bg-transparent py-4'}`}>
        {/* We use `relative` here so the absolute-centered nav menu anchors perfectly to the container */}
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between relative">

          {/* 1. LEFT SIDE: Logo & Branding */}
          <div className="flex items-center justify-start z-10 w-40">
            <Link href="/" className="flex items-center justify-center group gap-0">
              <span className="text-[20px] md:text-[24px] font-black tracking-tight leading-none transition-colors">
                <span className="text-white">Digital</span><span className="text-[#F56A22]">Broker</span>
              </span>
            </Link>
          </div>

          {/* 2. CENTER: Navigation Menu (Absolute Center mapped to container) */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-8 xl:gap-12 z-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 whitespace-nowrap hover:text-orange-500 ${link.special
                  ? 'text-orange-500 hover:text-orange-400 font-black tracking-[0.2em]'
                  : 'text-white/80'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-end gap-5 z-10">
            <div className={`hidden md:flex items-center gap-5 pr-5 border-r ${forceSolid ? 'border-white/10' : 'border-white/20'}`}>
              <a href="https://www.facebook.com/share/1RZcxJ8ar8/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-orange-500 transition-all hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z" /></svg>
              </a>
              <a href="https://www.instagram.com/_digital_broker?igsh=MXBta3N3ZzJrczhkdg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-orange-500 transition-all hover:scale-110">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.linkedin.com/company/113533925/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-orange-500 transition-all hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>

            <Link href="/search" className="text-white hover:text-orange-500 transition-colors p-2 rounded-full hover:bg-white/5">
              <Search className="w-5 h-5" />
            </Link>

            {isUser && (
              <>
                <Link href="/dashboard" className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/90 hover:text-orange-500 transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={handleUserLogout}
                  className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/90 hover:text-orange-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden text-white hover:text-orange-500 transition-colors p-2`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[110] bg-[#0a1628] transition-transform duration-500 flex flex-col justify-center items-center ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-8 right-8 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <span className="text-[28px] font-black tracking-tight leading-none mb-10">
          <span className="text-white">Digital</span><span className="text-[#F56A22]">Broker</span>
        </span>

        <div className="flex flex-col items-center space-y-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-2xl font-black uppercase tracking-widest transition-colors ${link.special ? 'text-orange-500' : 'text-white hover:text-orange-500'}`}
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
