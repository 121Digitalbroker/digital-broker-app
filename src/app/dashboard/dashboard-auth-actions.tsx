"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export default function DashboardAuthActions() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard/profile"
        className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 sm:px-4 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/15 hover:border-white/40 transition-colors"
      >
        My details
      </Link>
      <SignOutButton redirectUrl="/">
        <button
          type="button"
          className="rounded-xl bg-[#F56A22] px-3 py-2 sm:px-4 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white hover:bg-orange-600 transition-colors shadow-lg shadow-black/20"
        >
          Sign out
        </button>
      </SignOutButton>
    </div>
  );
}
