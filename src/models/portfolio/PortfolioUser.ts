import type { Connection, Model } from "mongoose";
import { Schema, Document } from "mongoose";
import portfolioDbConnect from "@/lib/mongodb-portfolio";

/**
 * Extended profile for portfolio customers — same Mongo connection as
 * `PortfolioProperty` (`mongodb-portfolio.ts`). Clerk remains auth source;
 * this row is optional extras (company, notes, etc.) keyed by `clerkUserId`.
 */
export interface IPortfolioUser extends Document {
  /** Clerk `user_...` id — unique per portfolio profile */
  clerkUserId: string;
  /** Legal / display name for portfolio (separate from Clerk display name) */
  fullName?: string;
  displayName?: string;
  companyName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateOrRegion?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioUserSchema = new Schema<IPortfolioUser>(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String },
    displayName: { type: String },
    companyName: { type: String },
    phone: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    stateOrRegion: { type: String },
    postalCode: { type: String },
    country: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

function getModelOnConnection(conn: Connection): Model<IPortfolioUser> {
  return (
    (conn.models.PortfolioUser as Model<IPortfolioUser>) ||
    conn.model<IPortfolioUser>("PortfolioUser", PortfolioUserSchema)
  );
}

export async function getPortfolioUserModel(): Promise<Model<IPortfolioUser>> {
  const conn = await portfolioDbConnect();
  return getModelOnConnection(conn);
}

export function getPortfolioUserModelOnConnection(
  conn: Connection
): Model<IPortfolioUser> {
  return getModelOnConnection(conn);
}
