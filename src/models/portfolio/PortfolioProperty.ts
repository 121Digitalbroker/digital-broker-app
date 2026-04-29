import type { Connection, Model } from "mongoose";
import { Schema, Document } from "mongoose";
import portfolioDbConnect from "@/lib/mongodb-portfolio";

const PROPERTY_CATEGORY_ENUM = [
  "residential_ready",
  "residential_under_construction",
  "commercial_ready",
  "commercial_under_construction",
  "residential",
  "commercial",
] as const;

const LocationSchema = new Schema(
  {
    cityMicroMarket: { type: String },
    sector: { type: String },
  },
  { _id: false }
);

const FinancialsSchema = new Schema(
  {
    purchaseDate: { type: Date },
    acquisitionCost: { type: Number },
    perSqftCost: { type: Number },
    otherCharges: { type: Number },
    totalAreaCarpetSqft: { type: Number },
    totalAreaSuperBuiltUpSqft: { type: Number },
    areaBasis: {
      type: String,
      enum: ["carpet", "super_built", "both"],
    },
    fundingType: { type: String, enum: ["self_funded", "loan"] },
    bankName: { type: String },
    emiAmount: { type: Number },
    interestRate: { type: Number },
    balanceLoanRemaining: { type: Number },
    selfFundedPaidAmount: { type: Number },
    selfFundedRemainingAmount: { type: Number },
  },
  { _id: false }
);

const ResidentialReadySchema = new Schema(
  {
    tower: String,
    phase: String,
    floor: String,
    flatNo: String,
    configuration: String,
    occupancyStatus: { type: String, enum: ["self_occupied", "rented", ""] },
    monthlyRent: Number,
    securityDeposit: Number,
    leaseExpiryDate: Date,
    monthlyMaintenance: Number,
    annualPropertyTax: Number,
  },
  { _id: false }
);

const ResidentialUnderConstructionSchema = new Schema(
  {
    unitNumber: String,
    expectedPossessionDate: Date,
    constructionStage: String,
    paymentPlanType: String,
    amountPaidTillDate: Number,
    remainingBalance: Number,
    reraNumber: String,
    delayCompensationClauseAmount: Number,
  },
  { _id: false }
);

const AssuredReturnsSchema = new Schema(
  {
    amountPerMonth: Number,
    durationMonths: Number,
    gstPaid: Boolean,
    gstInputCreditEligible: Boolean,
  },
  { _id: false }
);

const CommercialUnderConstructionSchema = new Schema(
  {
    inventoryType: String,
    expectedPossessionDate: Date,
    assuredReturnsEnabled: Boolean,
    assuredReturns: AssuredReturnsSchema,
    floorType: String,
  },
  { _id: false }
);

const TenantDetailsSchema = new Schema(
  {
    tenantType: String,
  },
  { _id: false }
);

const LeaseTermsSchema = new Schema(
  {
    lockInPeriodMonths: Number,
    leaseStartDate: Date,
    leaseEndDate: Date,
    escalationPercent: Number,
    escalationEveryYears: Number,
  },
  { _id: false }
);

const CommercialReadySchema = new Schema(
  {
    commercialPropertyType: String,
    leaseStatus: String,
    monthlyRent: Number,
    monthlyMaintenance: Number,
    annualPropertyTax: Number,
    insuranceAnnual: Number,
    tenantDetails: TenantDetailsSchema,
    leaseTerms: LeaseTermsSchema,
  },
  { _id: false }
);

/**
 * Customer portfolio listing — portfolio Mongo only.
 * Nested blocks support analytics; legacy flat fields remain for older rows.
 */
export interface IPortfolioProperty extends Document {
  ownerId: string;
  isDraft?: boolean;
  includeInDashboard?: boolean;
  propertyCategory?: (typeof PROPERTY_CATEGORY_ENUM)[number];
  constructionStatus?: "ready" | "under_construction";

  developerName?: string;
  projectName?: string;
  description?: string;

  city?: string;
  sector?: string;
  propertyType?: "residential" | "commercial" | "both";
  aboutProject?: string;
  residentialConfigs?: unknown[];
  commercialConfigs?: unknown[];

  location?: {
    cityMicroMarket?: string;
    sector?: string;
  };
  financials?: Record<string, unknown>;
  residentialReady?: Record<string, unknown>;
  residentialUnderConstruction?: Record<string, unknown>;
  commercialUnderConstruction?: Record<string, unknown>;
  commercialReady?: Record<string, unknown>;
  csvSummary?: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;
}

const PortfolioPropertySchema = new Schema<IPortfolioProperty>(
  {
    ownerId: { type: String, required: true, index: true },
    isDraft: { type: Boolean, default: false },
    includeInDashboard: { type: Boolean, default: true },
    propertyCategory: {
      type: String,
      enum: [...PROPERTY_CATEGORY_ENUM],
    },
    constructionStatus: {
      type: String,
      enum: ["ready", "under_construction"],
      default: "ready",
    },

    developerName: { type: String },
    projectName: { type: String },
    description: { type: String },

    city: { type: String },
    sector: { type: String },
    propertyType: {
      type: String,
      enum: ["residential", "commercial", "both"],
    },
    aboutProject: { type: String },
    residentialConfigs: [{ type: Schema.Types.Mixed }],
    commercialConfigs: [{ type: Schema.Types.Mixed }],

    location: LocationSchema,
    financials: FinancialsSchema,
    residentialReady: ResidentialReadySchema,
    residentialUnderConstruction: ResidentialUnderConstructionSchema,
    commercialUnderConstruction: CommercialUnderConstructionSchema,
    commercialReady: CommercialReadySchema,
    csvSummary: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

function getModelOnConnection(
  conn: Connection
): Model<IPortfolioProperty> {
  const existing = conn.models.PortfolioProperty as Model<IPortfolioProperty> | undefined;
  if (existing) {
    // In Next.js dev HMR, mongoose caches compiled models.
    // Ensure newly added paths are available without requiring a server restart.
    if (!existing.schema.path("includeInDashboard")) {
      existing.schema.add({
        includeInDashboard: { type: Boolean, default: true },
      });
    }
    if (!existing.schema.path("csvSummary")) {
      existing.schema.add({
        csvSummary: { type: Schema.Types.Mixed },
      });
    }
    return existing;
  }
  return conn.model<IPortfolioProperty>("PortfolioProperty", PortfolioPropertySchema);
}

export async function getPortfolioPropertyModel(): Promise<
  Model<IPortfolioProperty>
> {
  const conn = await portfolioDbConnect();
  return getModelOnConnection(conn);
}

export function getPortfolioPropertyModelOnConnection(
  conn: Connection
): Model<IPortfolioProperty> {
  return getModelOnConnection(conn);
}
