import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPortfolioPropertyModel } from "@/models/portfolio/PortfolioProperty";
import { getPortfolioUserModel } from "@/models/portfolio/PortfolioUser";
import { isPortfolioProfileComplete } from "@/lib/portfolio-profile";
import { PORTFOLIO_SUMMARY_SEED_ROWS } from "@/lib/portfolio-summary-seed";

function toCommercialType(product: string): "Retail Shop" | "Office Space" {
  const normalized = product.toLowerCase();
  if (normalized.includes("studio")) return "Office Space";
  return "Retail Shop";
}

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const PortfolioUser = await getPortfolioUserModel();
    const userDoc = await PortfolioUser.findOne({ clerkUserId: userId }).lean();
    if (!isPortfolioProfileComplete(userDoc)) {
      return NextResponse.json(
        {
          error: "Complete your portfolio profile before importing properties.",
          code: "PROFILE_INCOMPLETE",
        },
        { status: 403 }
      );
    }

    const PortfolioProperty = await getPortfolioPropertyModel();
    let imported = 0;
    let skipped = 0;

    for (const row of PORTFOLIO_SUMMARY_SEED_ROWS) {
      const existing = await PortfolioProperty.findOne({
        ownerId: userId,
        developerName: row.developerName,
        projectName: row.projectName,
        sector: row.unitDetails,
      })
        .select({ _id: 1 })
        .lean();

      if (existing) {
        skipped += 1;
        continue;
      }

      await PortfolioProperty.create({
        ownerId: userId,
        isDraft: false,
        propertyCategory: "commercial_ready",
        constructionStatus: "ready",
        propertyType: "commercial",
        developerName: row.developerName,
        projectName: row.projectName,
        description: `Imported from CSV summary - Unit ${row.unitDetails} (${row.csvSummary.product}).`,
        aboutProject: `Imported from CSV summary - Unit ${row.unitDetails} (${row.csvSummary.product}).`,
        city: "Noida",
        sector: row.unitDetails,
        location: {
          cityMicroMarket: "Noida",
          sector: row.unitDetails,
        },
        financials: {
          purchaseDate: new Date(row.purchaseDate),
          acquisitionCost: row.acquisitionCost,
          perSqftCost: row.sizeSqft > 0 ? row.acquisitionCost / row.sizeSqft : 0,
          otherCharges: row.otherCharges,
          totalAreaCarpetSqft: 0,
          totalAreaSuperBuiltUpSqft: row.sizeSqft,
          areaBasis: "super_built",
          fundingType: "self_funded",
          bankName: "",
          emiAmount: 0,
          interestRate: 0,
          balanceLoanRemaining: 0,
          selfFundedPaidAmount: row.paidAmount,
          selfFundedRemainingAmount: row.balanceAmount,
        },
        csvSummary: row.csvSummary,
        commercialReady: {
          commercialPropertyType: toCommercialType(row.csvSummary.product),
          leaseStatus: row.expectedMonthlyRent > 0 ? "pre_leased" : "vacant",
          monthlyRent: row.expectedMonthlyRent,
          monthlyMaintenance: 0,
          annualPropertyTax: 0,
          insuranceAnnual: 0,
          tenantDetails: {
            tenantType: "Local Brand",
          },
          leaseTerms: {
            lockInPeriodMonths: 12,
            leaseStartDate: new Date(row.purchaseDate),
            leaseEndDate: new Date("2029-12-31"),
            escalationPercent: 5,
            escalationEveryYears: 1,
          },
        },
      });

      imported += 1;
    }

    return NextResponse.json({
      message: "Summary import complete.",
      imported,
      skipped,
      total: PORTFOLIO_SUMMARY_SEED_ROWS.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

