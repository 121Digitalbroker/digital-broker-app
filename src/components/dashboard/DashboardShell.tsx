import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  children: ReactNode;
  actions?: ReactNode;
};

export default function DashboardShell({ children, actions }: Props) {
  return (
    <div className="min-h-screen bg-[#eef1f6] text-[#0a1628] font-sans antialiased">
      <header className="sticky top-0 z-50 bg-[#0a1628] border-b border-white/10 shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-3 sm:h-[4.25rem] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 sm:py-0">
          <Link href="/" className="shrink-0 text-lg sm:text-xl font-black tracking-tight w-fit">
            <span className="text-white">Digital</span>
            <span className="text-[#F56A22]">Broker</span>
          </Link>
          <nav className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/65 sm:justify-center">
            <Link href="/dashboard" className="hover:text-[#F56A22] transition-colors whitespace-nowrap">
              Portfolio
            </Link>
            <Link
              href="/dashboard/my-properties"
              className="hover:text-[#F56A22] transition-colors whitespace-nowrap"
            >
              My properties
            </Link>
            <Link href="/dashboard/profile" className="hover:text-[#F56A22] transition-colors whitespace-nowrap">
              My details
            </Link>
            <Link href="/dashboard/create" className="hover:text-[#F56A22] transition-colors whitespace-nowrap">
              Add property
            </Link>
          </nav>
          {actions ? <div className="flex shrink-0 items-center justify-end gap-2">{actions}</div> : null}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 md:py-12">{children}</div>
    </div>
  );
}
