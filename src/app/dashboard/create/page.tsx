import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { requirePortfolioProfileComplete } from "@/lib/portfolio-profile-check";
import CreateDashboardPropertyForm from "@/app/dashboard/create/property-form";

export default async function CreateDashboardPropertyPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/dashboard/create");

  await requirePortfolioProfileComplete(userId, "/dashboard/create");

  return (
    <>
      <div className="mb-10">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F56A22] mb-2">
          Portfolio
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-[#0a1628] tracking-tight">
          Add property
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl leading-relaxed">
          Create a listing in your private portfolio. It will not appear on the public DigitalBroker
          homepage.
        </p>
      </div>
      <CreateDashboardPropertyForm />
    </>
  );
}
