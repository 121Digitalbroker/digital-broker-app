"use client";
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ArrowLeft, LogOut } from 'lucide-react';

const AdminNavbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_role');
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0a1628] shadow-2xl border-b border-white/5">
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-[20px] md:text-[24px] font-black tracking-tight leading-none">
            <span className="text-white">Digital</span><span className="text-[#F56A22]">Broker</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-500 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-orange-500/20">
            CMS
          </span>
        </Link>

        {/* Right: Dashboard + Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all border border-white/10 hover:border-orange-500/30"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
