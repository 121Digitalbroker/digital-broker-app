import { redirect } from "next/navigation";
import { getPortfolioUserModel } from "@/models/portfolio/PortfolioUser";
import { isPortfolioProfileComplete } from "@/lib/portfolio-profile";

/** Redirect to portfolio profile until required personal fields are saved. */
export async function requirePortfolioProfileComplete(
  userId: string,
  nextPath: string
): Promise<void> {
  const PortfolioUser = await getPortfolioUserModel();
  const doc = await PortfolioUser.findOne({ clerkUserId: userId }).lean();
  if (!isPortfolioProfileComplete(doc)) {
    const q = new URLSearchParams({ next: nextPath });
    redirect(`/dashboard/profile?${q.toString()}`);
  }
}
