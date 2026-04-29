import type { PortfolioCategory } from "./portfolio-investment-calcs";

function pickStr(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function pickNum(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function pickBool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function pickObj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

export const PROPERTY_CATEGORIES: {
  value: PortfolioCategory;
  label: string;
}[] = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
];

export function categoryLabel(cat: PortfolioCategory | ""): string {
  const row = PROPERTY_CATEGORIES.find((c) => c.value === cat);
  return row?.label ?? "Property";
}

export type FundingType = "self_funded" | "loan";
export type AreaBasis = "carpet" | "super_built" | "both";

export type PortfolioPropertyPayload = {
  isDraft: boolean;
  propertyType: PortfolioCategory;
  constructionStatus: "ready" | "under_construction";
  developerName: string;
  projectName: string;
  description: string;
  location: {
    city: string;
    cityMicroMarket: string;
    sector: string;
  };
  financials: {
    purchaseDate: string;
    acquisitionCost: number;
    perSqftCost: number;
    otherCharges: number;
    totalAreaCarpetSqft: number;
    totalAreaSuperBuiltUpSqft: number;
    areaBasis: AreaBasis;
    fundingType: FundingType;
    bankName: string;
    emiAmount: number;
    interestRate: number;
    balanceLoanRemaining: number;
    selfFundedPaidAmount: number;
    selfFundedRemainingAmount: number;
  };
  residentialReady: {
    tower: string;
    phase: string;
    floor: string;
    flatNo: string;
    configuration: string;
    occupancyStatus: "self_occupied" | "rented" | "";
    monthlyRent: number;
    securityDeposit: number;
    leaseExpiryDate: string;
    monthlyMaintenance: number;
    annualPropertyTax: number;
  };
  residentialUnderConstruction: {
    unitNumber: string;
    expectedPossessionDate: string;
    constructionStage: string;
    paymentPlanType: string;
    amountPaidTillDate: number;
    remainingBalance: number;
    reraNumber: string;
    delayCompensationClauseAmount: number;
  };
  commercialUnderConstruction: {
    inventoryType: string;
    expectedPossessionDate: string;
    assuredReturnsEnabled: boolean;
    assuredReturns: {
      amountPerMonth: number;
      durationMonths: number;
      gstPaid: boolean;
      gstInputCreditEligible: boolean;
    };
    floorType: string;
  };
  commercialReady: {
    commercialPropertyType: string;
    leaseStatus: "vacant" | "pre_leased" | "";
    monthlyRent: number;
    monthlyMaintenance: number;
    annualPropertyTax: number;
    insuranceAnnual: number;
    tenantDetails: {
      tenantType: string;
    };
    leaseTerms: {
      lockInPeriodMonths: number;
      leaseStartDate: string;
      leaseEndDate: string;
      escalationPercent: number;
      escalationEveryYears: number;
    };
  };
};

/** Merge untrusted JSON into a full payload (defaults for missing keys). */
export function parsePortfolioPropertyBody(raw: unknown): PortfolioPropertyPayload {
  const d = emptyPayload();
  if (!raw || typeof raw !== "object") return d;
  const b = raw as Record<string, unknown>;

  const loc = pickObj(b.location);
  const fin = pickObj(b.financials);
  const rr = pickObj(b.residentialReady);
  const ruc = pickObj(b.residentialUnderConstruction);
  const cuc = pickObj(b.commercialUnderConstruction);
  const ar = pickObj(cuc.assuredReturns);
  const cr = pickObj(b.commercialReady);
  const td = pickObj(cr.tenantDetails);
  const lt = pickObj(cr.leaseTerms);

  const typeRaw = pickStr(
    b.propertyType,
    pickStr(b.propertyCategory, d.propertyType),
  );
  const validType = PROPERTY_CATEGORIES.some((c) => c.value === typeRaw);
  const statusRaw = pickStr(b.constructionStatus, d.constructionStatus);

  return {
    isDraft: pickBool(b.isDraft, d.isDraft),
    propertyType: (validType ? typeRaw : d.propertyType) as PortfolioCategory,
    constructionStatus:
      statusRaw === "under_construction" ? "under_construction" : "ready",
    developerName: pickStr(b.developerName, d.developerName),
    projectName: pickStr(b.projectName, d.projectName),
    description: pickStr(b.description, d.description),
    location: {
      city: pickStr(loc.city, d.location.city),
      cityMicroMarket: pickStr(loc.cityMicroMarket, d.location.cityMicroMarket),
      sector: pickStr(loc.sector, d.location.sector),
    },
    financials: {
      purchaseDate: pickStr(fin.purchaseDate, d.financials.purchaseDate),
      acquisitionCost: pickNum(fin.acquisitionCost, d.financials.acquisitionCost),
      perSqftCost: pickNum(fin.perSqftCost, d.financials.perSqftCost),
      otherCharges: pickNum(fin.otherCharges, d.financials.otherCharges),
      totalAreaCarpetSqft: pickNum(
        fin.totalAreaCarpetSqft,
        d.financials.totalAreaCarpetSqft
      ),
      totalAreaSuperBuiltUpSqft: pickNum(
        fin.totalAreaSuperBuiltUpSqft,
        d.financials.totalAreaSuperBuiltUpSqft
      ),
      areaBasis: (["carpet", "super_built", "both"].includes(
        pickStr(fin.areaBasis, "")
      )
        ? pickStr(fin.areaBasis, d.financials.areaBasis)
        : d.financials.areaBasis) as AreaBasis,
      fundingType: (["self_funded", "loan"].includes(pickStr(fin.fundingType, ""))
        ? pickStr(fin.fundingType, d.financials.fundingType)
        : d.financials.fundingType) as FundingType,
      bankName: pickStr(fin.bankName, d.financials.bankName),
      emiAmount: pickNum(fin.emiAmount, d.financials.emiAmount),
      interestRate: pickNum(fin.interestRate, d.financials.interestRate),
      balanceLoanRemaining: pickNum(
        fin.balanceLoanRemaining,
        d.financials.balanceLoanRemaining
      ),
      selfFundedPaidAmount: pickNum(
        fin.selfFundedPaidAmount,
        d.financials.selfFundedPaidAmount
      ),
      selfFundedRemainingAmount: pickNum(
        fin.selfFundedRemainingAmount,
        d.financials.selfFundedRemainingAmount
      ),
    },
    residentialReady: {
      tower: pickStr(rr.tower, d.residentialReady.tower),
      phase: pickStr(rr.phase, d.residentialReady.phase),
      floor: pickStr(rr.floor, d.residentialReady.floor),
      flatNo: pickStr(rr.flatNo, d.residentialReady.flatNo),
      configuration: pickStr(rr.configuration, d.residentialReady.configuration),
      occupancyStatus: (pickStr(
        rr.occupancyStatus,
        d.residentialReady.occupancyStatus
      ) || "") as PortfolioPropertyPayload["residentialReady"]["occupancyStatus"],
      monthlyRent: pickNum(rr.monthlyRent, d.residentialReady.monthlyRent),
      securityDeposit: pickNum(rr.securityDeposit, d.residentialReady.securityDeposit),
      leaseExpiryDate: pickStr(rr.leaseExpiryDate, d.residentialReady.leaseExpiryDate),
      monthlyMaintenance: pickNum(
        rr.monthlyMaintenance,
        d.residentialReady.monthlyMaintenance
      ),
      annualPropertyTax: pickNum(rr.annualPropertyTax, d.residentialReady.annualPropertyTax),
    },
    residentialUnderConstruction: {
      unitNumber: pickStr(ruc.unitNumber, d.residentialUnderConstruction.unitNumber),
      expectedPossessionDate: pickStr(
        ruc.expectedPossessionDate,
        d.residentialUnderConstruction.expectedPossessionDate
      ),
      constructionStage: pickStr(
        ruc.constructionStage,
        d.residentialUnderConstruction.constructionStage
      ),
      paymentPlanType: pickStr(
        ruc.paymentPlanType,
        d.residentialUnderConstruction.paymentPlanType
      ),
      amountPaidTillDate: pickNum(
        ruc.amountPaidTillDate,
        d.residentialUnderConstruction.amountPaidTillDate
      ),
      remainingBalance: pickNum(
        ruc.remainingBalance,
        d.residentialUnderConstruction.remainingBalance
      ),
      reraNumber: pickStr(ruc.reraNumber, d.residentialUnderConstruction.reraNumber),
      delayCompensationClauseAmount: pickNum(
        ruc.delayCompensationClauseAmount,
        d.residentialUnderConstruction.delayCompensationClauseAmount
      ),
    },
    commercialUnderConstruction: {
      inventoryType: pickStr(
        cuc.inventoryType,
        d.commercialUnderConstruction.inventoryType
      ),
      expectedPossessionDate: pickStr(
        cuc.expectedPossessionDate,
        d.commercialUnderConstruction.expectedPossessionDate
      ),
      assuredReturnsEnabled: pickBool(
        cuc.assuredReturnsEnabled,
        d.commercialUnderConstruction.assuredReturnsEnabled
      ),
      assuredReturns: {
        amountPerMonth: pickNum(
          ar.amountPerMonth,
          d.commercialUnderConstruction.assuredReturns.amountPerMonth
        ),
        durationMonths: pickNum(
          ar.durationMonths,
          d.commercialUnderConstruction.assuredReturns.durationMonths
        ),
        gstPaid: pickBool(ar.gstPaid, d.commercialUnderConstruction.assuredReturns.gstPaid),
        gstInputCreditEligible: pickBool(
          ar.gstInputCreditEligible,
          d.commercialUnderConstruction.assuredReturns.gstInputCreditEligible
        ),
      },
      floorType: pickStr(cuc.floorType, d.commercialUnderConstruction.floorType),
    },
    commercialReady: {
      commercialPropertyType: pickStr(
        cr.commercialPropertyType,
        d.commercialReady.commercialPropertyType
      ),
      leaseStatus: (pickStr(cr.leaseStatus, d.commercialReady.leaseStatus) ||
        "") as PortfolioPropertyPayload["commercialReady"]["leaseStatus"],
      monthlyRent: pickNum(cr.monthlyRent, d.commercialReady.monthlyRent),
      monthlyMaintenance: pickNum(
        cr.monthlyMaintenance,
        d.commercialReady.monthlyMaintenance
      ),
      annualPropertyTax: pickNum(cr.annualPropertyTax, d.commercialReady.annualPropertyTax),
      insuranceAnnual: pickNum(cr.insuranceAnnual, d.commercialReady.insuranceAnnual),
      tenantDetails: {
        tenantType: pickStr(td.tenantType, d.commercialReady.tenantDetails.tenantType),
      },
      leaseTerms: {
        lockInPeriodMonths: pickNum(
          lt.lockInPeriodMonths,
          d.commercialReady.leaseTerms.lockInPeriodMonths
        ),
        leaseStartDate: pickStr(lt.leaseStartDate, d.commercialReady.leaseTerms.leaseStartDate),
        leaseEndDate: pickStr(lt.leaseEndDate, d.commercialReady.leaseTerms.leaseEndDate),
        escalationPercent: pickNum(
          lt.escalationPercent,
          d.commercialReady.leaseTerms.escalationPercent
        ),
        escalationEveryYears: pickNum(
          lt.escalationEveryYears,
          d.commercialReady.leaseTerms.escalationEveryYears
        ),
      },
    },
  };
}

export function legacyPropertyTypeFromCategory(
  cat: PortfolioCategory
): "residential" | "commercial" {
  return cat === "residential" ? "residential" : "commercial";
}

export function emptyPayload(): PortfolioPropertyPayload {
  return {
    isDraft: false,
    propertyType: "residential",
    constructionStatus: "ready",
    developerName: "",
    projectName: "",
    description: "",
    location: { city: "", cityMicroMarket: "", sector: "" },
    financials: {
      purchaseDate: "",
      acquisitionCost: 0,
      perSqftCost: 0,
      otherCharges: 0,
      totalAreaCarpetSqft: 0,
      totalAreaSuperBuiltUpSqft: 0,
      areaBasis: "super_built",
      fundingType: "self_funded",
      bankName: "",
      emiAmount: 0,
      interestRate: 0,
      balanceLoanRemaining: 0,
      selfFundedPaidAmount: 0,
      selfFundedRemainingAmount: 0,
    },
    residentialReady: {
      tower: "",
      phase: "",
      floor: "",
      flatNo: "",
      configuration: "",
      occupancyStatus: "",
      monthlyRent: 0,
      securityDeposit: 0,
      leaseExpiryDate: "",
      monthlyMaintenance: 0,
      annualPropertyTax: 0,
    },
    residentialUnderConstruction: {
      unitNumber: "",
      expectedPossessionDate: "",
      constructionStage: "",
      paymentPlanType: "",
      amountPaidTillDate: 0,
      remainingBalance: 0,
      reraNumber: "",
      delayCompensationClauseAmount: 0,
    },
    commercialUnderConstruction: {
      inventoryType: "",
      expectedPossessionDate: "",
      assuredReturnsEnabled: false,
      assuredReturns: {
        amountPerMonth: 0,
        durationMonths: 0,
        gstPaid: false,
        gstInputCreditEligible: false,
      },
      floorType: "",
    },
    commercialReady: {
      commercialPropertyType: "",
      leaseStatus: "",
      monthlyRent: 0,
      monthlyMaintenance: 0,
      annualPropertyTax: 0,
      insuranceAnnual: 0,
      tenantDetails: { tenantType: "" },
      leaseTerms: {
        lockInPeriodMonths: 0,
        leaseStartDate: "",
        leaseEndDate: "",
        escalationPercent: 0,
        escalationEveryYears: 0,
      },
    },
  };
}

const RES_CONFIG = ["3", "3+", "4", "4H", "5", "1BHK", "2BHK", "3BHK"] as const;

function normalizeConfiguration(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}
const COM_READY_TYPE = [
  "Retail Shop",
  "Office Space",
  "Warehouse",
  "Showroom",
] as const;
const TENANT_TYPES = ["MNC", "Bank", "Local Brand", "Startup"] as const;

export function validatePortfolioPayload(
  p: PortfolioPropertyPayload,
  isDraft: boolean,
): string[] {
  const errs: string[] = [];
  if (isDraft) {
    return errs;
  }
  if (!p.developerName?.trim()) errs.push("Developer name is required.");
  if (!p.projectName?.trim()) errs.push("Project name is required.");
  if (!p.location.cityMicroMarket?.trim())
    errs.push("City / micro-market is required.");
  if (!p.financials.purchaseDate) errs.push("Purchase date is required.");
  if (p.financials.acquisitionCost <= 0)
    errs.push("Acquisition cost must be greater than zero.");
  if (p.financials.fundingType === "loan") {
    if (!p.financials.bankName?.trim()) errs.push("Bank name is required for loan.");
  } else {
    if (p.financials.selfFundedPaidAmount < 0) {
      errs.push("Self-funded paid amount cannot be negative.");
    }
  }

  const areaOk =
    (p.financials.areaBasis === "carpet" &&
      p.financials.totalAreaCarpetSqft > 0) ||
    (p.financials.areaBasis === "super_built" &&
      p.financials.totalAreaSuperBuiltUpSqft > 0) ||
    (p.financials.areaBasis === "both" &&
      p.financials.totalAreaCarpetSqft > 0 &&
      p.financials.totalAreaSuperBuiltUpSqft > 0);
  if (!areaOk) errs.push("Enter total area for the selected basis.");

  if (p.propertyType === "residential" && p.constructionStatus === "ready") {
      const c = normalizeConfiguration(p.residentialReady.configuration || "");
      if (!c) errs.push("Type / series is required.");
      if (!p.residentialReady.occupancyStatus)
        errs.push("Select occupancy status.");
      if (p.residentialReady.occupancyStatus === "rented") {
        if (p.residentialReady.monthlyRent <= 0)
          errs.push("Monthly rent is required when rented.");
      }
  } else if (p.propertyType === "commercial" && p.constructionStatus === "ready") {
      if (
        !COM_READY_TYPE.includes(
          p.commercialReady.commercialPropertyType as (typeof COM_READY_TYPE)[number],
        )
      )
        errs.push("Select commercial property type.");
      if (!p.commercialReady.leaseStatus)
        errs.push("Select lease status.");
      if (
        !TENANT_TYPES.includes(
          p.commercialReady.tenantDetails.tenantType as (typeof TENANT_TYPES)[number],
        )
      )
        errs.push("Select tenant type.");
      if (p.commercialReady.leaseTerms.lockInPeriodMonths <= 0)
        errs.push("Lock-in period is required.");
      if (!p.commercialReady.leaseTerms.leaseStartDate)
        errs.push("Lease start date is required.");
      if (!p.commercialReady.leaseTerms.leaseEndDate)
        errs.push("Lease end date is required.");
  }
  return errs;
}
