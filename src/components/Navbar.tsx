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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${forceSolid ? 'bg-white shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Left Side: Logo & Main Nav */}
        <div className="flex items-center gap-12 text-left">
          <Link href="/" className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${forceSolid ? 'text-[#0a1628]' : 'text-white'}`}>
            Digital<span className="text-orange-500">Broker</span>
          </Link>
          
          <div className={`hidden lg:flex items-center space-x-8 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${forceSolid ? 'text-gray-500' : 'text-gray-300'}`}>
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <Link href="/search" className="hover:text-orange-500 transition-colors cursor-pointer">Explore</Link>
            <Link href="/about" className="hover:text-orange-500 transition-colors cursor-pointer">About</Link>
            <Link href="/support" className="hover:text-orange-500 transition-colors cursor-pointer">Support</Link>
            <Link href="/contact" className="hover:text-orange-500 transition-colors cursor-pointer text-orange-500">Contact</Link>
          </div>
        </div>

        {/* Right Side: Actions & User */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {isAdmin ? (
               <Link href={role === 'superadmin' ? '/superadmin' : '/admin'} className={`hidden sm:block px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 bg-[#0a1628] text-white hover:bg-orange-500`}>
                Dashboard
              </Link>
            ) : (
              <button className={`hidden sm:block px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${forceSolid ? 'bg-orange-500 text-white hover:bg-[#0a1628]' : 'bg-orange-500 text-white hover:scale-105'}`}>
                Enquire Now
              </button>
            )}
            
            <div className="flex items-center gap-3">
              <Link href="/search" className={`p-2 rounded-full cursor-pointer transition-colors ${forceSolid ? 'text-gray-400 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                <Search className="w-5 h-5" />
              </Link>
              <div className={`flex items-center gap-3 pl-3 border-l ${forceSolid ? 'border-gray-200' : 'border-white/10'}`}>
                 <div className="hidden md:flex flex-col items-end leading-none">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${forceSolid ? 'text-[#0a1628]' : 'text-white'}`}>
                      {isAdmin ? 'System Admin' : 'Welcome Guest'}
                    </span>
                    {isAdmin ? (
                      <button onClick={handleLogout} className="text-[9px] text-orange-500 mt-1 font-bold hover:underline">Sign Out</button>
                    ) : (
                      <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-tighter">Premium Access</span>
                    )}
                 </div>
                 <div className={`w-9 h-9 rounded-full border-2 p-0.5 overflow-hidden flex-shrink-0 ${isAdmin ? 'border-[#0a1628]' : 'border-orange-500'}`}>
                    <Link href={role === 'superadmin' ? "/superadmin" : "/admin"}>
                      <img src={isAdmin ? "https://i.pravatar.cc/150?u=admin" : "https://i.pravatar.cc/150?u=guest"} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    </Link>
                 </div>
              </div>
              <div className={`lg:hidden p-2 rounded-full cursor-pointer ${forceSolid ? 'text-[#0a1628]' : 'text-white'}`}>
                <Menu className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
