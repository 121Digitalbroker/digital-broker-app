import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getPortfolioUserModel } from "@/models/portfolio/PortfolioUser";
import PortfolioProfileForm, {
  type PortfolioProfileInitial,
} from "./profile-form";

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

function toInitial(doc: Record<string, unknown> | null): PortfolioProfileInitial {
  const s = (k: string) => (typeof doc?.[k] === "string" ? (doc[k] as string) : "");
  return {
    fullName: s("fullName"),
    phone: s("phone"),
    companyName: s("companyName"),
    addressLine1: s("addressLine1"),
    addressLine2: s("addressLine2"),
    city: s("city"),
    stateOrRegion: s("stateOrRegion"),
    postalCode: s("postalCode"),
    country: s("country"),
    notes: s("notes"),
  };
}

export default async function DashboardProfilePage({ searchParams }: PageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/dashboard/profile");

  const sp = await searchParams;
  const nextPath = sp.next?.startsWith("/") ? sp.next : "/dashboard";

  const PortfolioUser = await getPortfolioUserModel();
  const doc = await PortfolioUser.findOne({ clerkUserId: userId }).lean();
  const initial = toInitial(doc as Record<string, unknown> | null);

  return (
    <>
      <div className="mb-10">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F56A22] mb-2">
          Portfolio
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-[#0a1628] tracking-tight">
          Your details
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl leading-relaxed">
          Contact and address on file for your portfolio. This is stored in our database — it is
          separate from the email you use to sign in with Clerk.
        </p>
      </div>

      <div className="rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-300/40 p-6 sm:p-10 mb-8">
        <PortfolioProfileForm initial={initial} nextPath={nextPath} />
      </div>

      <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-xl bg-gradient-to-br from-[#0a1628] via-[#0f1f38] to-[#162845] p-6 sm:p-8">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#F56A22] mb-3">
          Sign-in
        </h2>
        <p className="text-white/80 text-sm leading-relaxed max-w-2xl">
          Email, Google, and password for logging in are handled by Clerk when you authenticate.
          To change how you sign in, use the same method you used at registration (for example,
          your Google account settings) or contact support if you need help moving to a different
          login.
        </p>
      </div>

      <p className="mt-8 text-center">
        <Link
          href="/dashboard"
          className="text-sm font-bold text-gray-500 hover:text-[#F56A22] transition-colors"
        >
          ← Back to portfolio
        </Link>
      </p>
    </>
  );
}
