import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardAuthActions from "./dashboard-auth-actions";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell actions={<DashboardAuthActions />}>{children}</DashboardShell>
  );
}
