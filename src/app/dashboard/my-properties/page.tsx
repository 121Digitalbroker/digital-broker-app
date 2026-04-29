import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPortfolioPropertyModel } from "@/models/portfolio/PortfolioProperty";
import { requirePortfolioProfileComplete } from "@/lib/portfolio-profile-check";
import VisibilityToggle from "./VisibilityToggle";

type PropertyRow = {
  _id: unknown;
  projectName?: string;
  propertyCategory?: string;
  includeInDashboard?: boolean;
  financials?: { acquisitionCost?: number };
  createdAt?: Date;
};

function labelFromCategory(v?: string): string {
  const value = String(v ?? "");
  if (value === "residential_ready") return "Residential • Ready";
  if (value === "residential_under_construction") return "Residential • Under Construction";
  if (value === "commercial_ready") return "Commercial • Ready";
  if (value === "commercial_under_construction") return "Commercial • Under Construction";
  return value || "—";
}

export default async function DashboardMyPropertiesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/dashboard/my-properties");

  await requirePortfolioProfileComplete(userId, "/dashboard/my-properties");

  const PortfolioProperty = await getPortfolioPropertyModel();
  const rows = (await PortfolioProperty.find({ ownerId: userId })
    .sort({ createdAt: -1 })
    .lean()) as PropertyRow[];

  return (
    <>
      <div className="mb-10 md:mb-12">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F56A22] mb-2">
          Portfolio hub
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-[#0a1628] tracking-tight">
          My properties
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl text-base leading-relaxed">
          View all your listings and open any property in edit mode.
        </p>
      </div>

      <section className="rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-300/40 overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-gray-50/80 to-white">
          <h2 className="text-lg font-black text-[#0a1628] tracking-tight">Listings</h2>
          <Link
            href="/dashboard/create"
            className="inline-flex rounded-xl bg-[#F56A22] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-600 transition-all"
          >
            Add property
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="p-10 sm:p-14 text-center">
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              No properties yet. Add your first listing to start tracking your portfolio.
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex rounded-2xl bg-[#F56A22] px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25"
            >
              Add property
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 bg-white">
                  <th className="px-6 sm:px-8 py-4">Project</th>
                  <th className="px-6 sm:px-8 py-4">Type</th>
                  <th className="px-6 sm:px-8 py-4">Investment</th>
                  <th className="px-6 sm:px-8 py-4">Created</th>
                  <th className="px-6 sm:px-8 py-4 text-center">Dashboard</th>
                  <th className="px-6 sm:px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row) => (
                  <tr key={String(row._id)} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-6 sm:px-8 py-5 font-bold text-[#0a1628]">
                      {row.projectName || "Untitled"}
                    </td>
                    <td className="px-6 sm:px-8 py-5 text-gray-600 text-sm font-medium">
                      {labelFromCategory(row.propertyCategory)}
                    </td>
                    <td className="px-6 sm:px-8 py-5 text-gray-600 text-sm font-medium">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(Number(row.financials?.acquisitionCost ?? 0))}
                    </td>
                    <td className="px-6 sm:px-8 py-5 text-gray-400 text-sm font-medium tabular-nums">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-6 sm:px-8 py-5 text-center">
                      <div className="inline-flex items-center gap-2">
                        <VisibilityToggle
                          id={String(row._id)}
                          initiallyHidden={row.includeInDashboard === false}
                        />
                        <span className="text-[10px] font-bold text-gray-400">
                          {row.includeInDashboard === false ? "Off" : "On"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-5 text-right">
                      <Link
                        href={`/dashboard/my-properties/${String(row._id)}`}
                        className="inline-flex rounded-xl border border-gray-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#0a1628] hover:border-[#F56A22]/40 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

