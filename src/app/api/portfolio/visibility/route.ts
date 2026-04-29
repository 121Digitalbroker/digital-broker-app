import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPortfolioPropertyModel } from "@/models/portfolio/PortfolioProperty";

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { id?: string; hidden?: boolean };
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) {
      return NextResponse.json({ error: "Property id is required." }, { status: 400 });
    }

    const hidden = Boolean(body.hidden);
    const PortfolioProperty = await getPortfolioPropertyModel();
    const updated = await PortfolioProperty.findOneAndUpdate(
      { _id: id, ownerId: userId },
      { $set: { includeInDashboard: !hidden } },
      { new: true }
    )
      .select({ _id: 1, includeInDashboard: 1 })
      .lean();

    if (!updated) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      hidden: updated.includeInDashboard === false,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

