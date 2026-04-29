import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPortfolioUserModel } from "@/models/portfolio/PortfolioUser";
import { isPortfolioProfileComplete } from "@/lib/portfolio-profile";

const ALLOWED_PATCH_KEYS = new Set([
  "fullName",
  "displayName",
  "companyName",
  "phone",
  "addressLine1",
  "addressLine2",
  "city",
  "stateOrRegion",
  "postalCode",
  "country",
  "notes",
]);

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const PortfolioUser = await getPortfolioUserModel();
    const profile = await PortfolioUser.findOne({ clerkUserId: userId }).lean();

    return NextResponse.json({
      profile: profile ?? null,
      complete: isPortfolioProfileComplete(profile),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const update: Record<string, string> = {};

    for (const key of ALLOWED_PATCH_KEYS) {
      if (!(key in body)) continue;
      const v = body[key];
      if (v === null || v === undefined) continue;
      update[key] = typeof v === "string" ? v : String(v);
    }

    const PortfolioUser = await getPortfolioUserModel();
    const profile = await PortfolioUser.findOneAndUpdate(
      { clerkUserId: userId },
      { $set: { clerkUserId: userId, ...update } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({
      profile,
      complete: isPortfolioProfileComplete(profile),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
