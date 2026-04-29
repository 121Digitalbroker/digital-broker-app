import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPortfolioPropertyModel } from "@/models/portfolio/PortfolioProperty";
import { getPortfolioUserModel } from "@/models/portfolio/PortfolioUser";
import { isPortfolioProfileComplete } from "@/lib/portfolio-profile";
import {
  legacyPropertyTypeFromCategory,
  parsePortfolioPropertyBody,
  validatePortfolioPayload,
} from "@/lib/portfolio-property-payload";

function toDate(s: string): Date | undefined {
  if (!s || typeof s !== "string") return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function buildDocPayload(userId: string, parsed: ReturnType<typeof parsePortfolioPropertyBody>) {
  const f = parsed.financials;
  const rr = parsed.residentialReady;
  const cr = parsed.commercialReady;

  const cityMicro = parsed.location.cityMicroMarket?.trim() || "";
  const legacyType = parsed.propertyType
    ? legacyPropertyTypeFromCategory(parsed.propertyType)
    : "residential";
  const categoryKey = `${parsed.propertyType}_${parsed.constructionStatus}`;

  const baseDoc = {
    ownerId: userId,
    isDraft: false,
    propertyCategory: categoryKey,
    constructionStatus: parsed.constructionStatus,
    developerName: parsed.developerName?.trim(),
    projectName: parsed.projectName?.trim(),
    description: parsed.description?.trim(),
    aboutProject: parsed.description?.trim(),
    city: cityMicro || undefined,
    sector: parsed.location.sector?.trim() || undefined,
    propertyType: legacyType,
    location: {
      cityMicroMarket: cityMicro || undefined,
      sector: parsed.location.sector?.trim() || undefined,
    },
    financials: {
      purchaseDate: toDate(f.purchaseDate),
      acquisitionCost: f.acquisitionCost,
      perSqftCost: f.perSqftCost,
      otherCharges: f.otherCharges,
      totalAreaCarpetSqft: f.totalAreaCarpetSqft,
      totalAreaSuperBuiltUpSqft: f.totalAreaSuperBuiltUpSqft,
      areaBasis: f.areaBasis,
      fundingType: f.fundingType,
      bankName: f.bankName?.trim() || undefined,
      emiAmount: f.emiAmount,
      interestRate: f.interestRate,
      balanceLoanRemaining: f.balanceLoanRemaining,
      selfFundedPaidAmount: f.selfFundedPaidAmount,
      selfFundedRemainingAmount: f.selfFundedRemainingAmount,
    },
    residentialConfigs: [] as unknown[],
    commercialConfigs: [] as unknown[],
  };

  const categoryBlocks: Record<string, Record<string, unknown>> = {
    residential_ready: {
      residentialReady: {
        tower: rr.tower,
        phase: rr.phase,
        floor: rr.floor,
        flatNo: rr.flatNo,
        configuration: rr.configuration,
        occupancyStatus: rr.occupancyStatus || undefined,
        monthlyRent: rr.monthlyRent,
        securityDeposit: rr.securityDeposit,
        leaseExpiryDate: toDate(rr.leaseExpiryDate),
        monthlyMaintenance: rr.monthlyMaintenance,
        annualPropertyTax: rr.annualPropertyTax,
      },
    },
    residential_under_construction: {
      residentialUnderConstruction: {
        unitNumber: parsed.residentialUnderConstruction.unitNumber,
        expectedPossessionDate: toDate(
          parsed.residentialUnderConstruction.expectedPossessionDate
        ),
        constructionStage: parsed.residentialUnderConstruction.constructionStage,
        paymentPlanType: parsed.residentialUnderConstruction.paymentPlanType,
        amountPaidTillDate: parsed.residentialUnderConstruction.amountPaidTillDate,
        remainingBalance: parsed.residentialUnderConstruction.remainingBalance,
        reraNumber: parsed.residentialUnderConstruction.reraNumber,
        delayCompensationClauseAmount:
          parsed.residentialUnderConstruction.delayCompensationClauseAmount,
      },
    },
    commercial_ready: {
      commercialReady: {
        commercialPropertyType: cr.commercialPropertyType,
        leaseStatus: cr.leaseStatus || undefined,
        monthlyRent: cr.monthlyRent,
        monthlyMaintenance: cr.monthlyMaintenance,
        annualPropertyTax: cr.annualPropertyTax,
        insuranceAnnual: cr.insuranceAnnual,
        tenantDetails: { tenantType: cr.tenantDetails.tenantType },
        leaseTerms: {
          lockInPeriodMonths: cr.leaseTerms.lockInPeriodMonths,
          leaseStartDate: toDate(cr.leaseTerms.leaseStartDate),
          leaseEndDate: toDate(cr.leaseTerms.leaseEndDate),
          escalationPercent: cr.leaseTerms.escalationPercent,
          escalationEveryYears: cr.leaseTerms.escalationEveryYears,
        },
      },
    },
    commercial_under_construction: {
      commercialUnderConstruction: {
        inventoryType: parsed.commercialUnderConstruction.inventoryType,
        expectedPossessionDate: toDate(
          parsed.commercialUnderConstruction.expectedPossessionDate
        ),
        assuredReturnsEnabled:
          parsed.commercialUnderConstruction.assuredReturnsEnabled,
        assuredReturns: {
          amountPerMonth:
            parsed.commercialUnderConstruction.assuredReturns.amountPerMonth,
          durationMonths:
            parsed.commercialUnderConstruction.assuredReturns.durationMonths,
          gstPaid: parsed.commercialUnderConstruction.assuredReturns.gstPaid,
          gstInputCreditEligible:
            parsed.commercialUnderConstruction.assuredReturns
              .gstInputCreditEligible,
        },
        floorType: parsed.commercialUnderConstruction.floorType,
      },
    },
  };

  return {
    ...baseDoc,
    ...(categoryBlocks[categoryKey] ?? {}),
  };
}

/**
 * Portfolio API — uses portfolio MongoDB only (`mongodb-portfolio.ts`).
 * Public site must keep using `/api/properties`.
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const PortfolioProperty = await getPortfolioPropertyModel();
    const items = await PortfolioProperty.find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(items);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
          error: "Complete your portfolio profile before adding a property.",
          code: "PROFILE_INCOMPLETE",
        },
        { status: 403 }
      );
    }

    const raw = await request.json();
    const parsed = parsePortfolioPropertyBody(raw);
    if (parsed.isDraft) {
      return NextResponse.json(
        {
          error:
            "Server-side drafts are not enabled. Use “Save draft” in the form (saved on this device).",
        },
        { status: 400 }
      );
    }
    const isDraft = false;

    const validationErrors = validatePortfolioPayload(parsed, isDraft);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(" "), details: validationErrors },
        { status: 400 }
      );
    }

    const docPayload = buildDocPayload(userId, parsed);

    const PortfolioProperty = await getPortfolioPropertyModel();
    const doc = await PortfolioProperty.create(docPayload);

    return NextResponse.json(doc, { status: 201 });
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

    const body = await request.json();
    const editId = typeof body.id === "string" ? body.id : "";
    if (!editId) {
      return NextResponse.json({ error: "Property id is required." }, { status: 400 });
    }

    const parsed = parsePortfolioPropertyBody(body);
    const validationErrors = validatePortfolioPayload(parsed, false);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(" "), details: validationErrors },
        { status: 400 }
      );
    }

    const PortfolioProperty = await getPortfolioPropertyModel();
    const updatePayload = buildDocPayload(userId, parsed);
    const updated = await PortfolioProperty.findOneAndUpdate(
      { _id: editId, ownerId: userId },
      { $set: updatePayload },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Property id is required." }, { status: 400 });
    }

    const PortfolioProperty = await getPortfolioPropertyModel();
    const deleted = await PortfolioProperty.findOneAndDelete({
      _id: id,
      ownerId: userId,
    }).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
