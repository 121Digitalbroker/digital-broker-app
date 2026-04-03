import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResidentialConfig {
  typology: '2BHK' | '3BHK' | '4BHK';
  unitSize: number;
  pricePerSqft: number;
  priceRangeMin?: number;
  priceRangeMax?: number;
  plcCharges?: number;
  otherCharges?: number;
  possessionDate?: Date;
  ticketSize: number;
}

export interface ICommercialConfig {
  commercialType: 'Retail' | 'Studio' | 'Office' | 'Food Court' | 'Gaming Zone' | 'Industrial';
  unitSize: number;
  pricePerSqft: number;
  leaseYears?: number;
  assuredReturnPct?: number;
  preLeased: boolean;
  ticketSize: number;
}

export interface IProperty extends Document {
  // Section 1 — Developer
  developerName: string;
  developerLogo?: string;

  // Section 2 — Project
  projectName: string;
  city: 'Noida' | 'Greater Noida' | 'Delhi' | 'Gurgaon';
  sector?: string;
  projectSize?: number;
  reraNumber?: string;
  projectStatus?: 'New Launch' | 'Under Construction' | 'Ready To Move';

  // Section 3 — Type
  propertyType: 'residential' | 'commercial' | 'both';

  // Section 4 — Residential Configs
  residentialConfigs?: IResidentialConfig[];

  // Section 5 — Commercial Configs
  commercialConfigs?: ICommercialConfig[];

  // Section 6 — Documents
  productImages?: string[];
  brochureUrl?: string;
  priceListUrl?: string;
  sitePlanUrl?: string;
  layoutPlanUrl?: string;

  // Metadata for listing compatibility
  isFeatured: boolean;
  isPromoted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResidentialConfigSchema = new Schema<IResidentialConfig>({
  typology: { type: String, enum: ['2BHK', '3BHK', '4BHK'], required: true },
  unitSize: { type: Number, required: true },
  pricePerSqft: { type: Number, required: true },
  priceRangeMin: { type: Number },
  priceRangeMax: { type: Number },
  plcCharges: { type: Number },
  otherCharges: { type: Number },
  possessionDate: { type: Date },
  ticketSize: { type: Number, required: true },
});

const CommercialConfigSchema = new Schema<ICommercialConfig>({
  commercialType: { type: String, enum: ['Retail', 'Studio', 'Office', 'Food Court', 'Gaming Zone', 'Industrial'], required: true },
  unitSize: { type: Number, required: true },
  pricePerSqft: { type: Number, required: true },
  leaseYears: { type: Number },
  assuredReturnPct: { type: Number },
  preLeased: { type: Boolean, default: false },
  ticketSize: { type: Number, required: true },
});

const PropertySchema = new Schema<IProperty>(
  {
    developerName: { type: String, required: true },
    developerLogo: { type: String },
    
    projectName: { type: String, required: true },
    city: { type: String, enum: ['Noida', 'Greater Noida', 'Delhi', 'Gurgaon'], required: true },
    sector: { type: String },
    projectSize: { type: Number },
    reraNumber: { type: String },
    projectStatus: { type: String, enum: ['New Launch', 'Under Construction', 'Ready To Move'] },

    propertyType: { type: String, enum: ['residential', 'commercial', 'both'], required: true },
    
    residentialConfigs: [ResidentialConfigSchema],
    commercialConfigs: [CommercialConfigSchema],
    
    productImages: [{ type: String }],
    brochureUrl: { type: String },
    priceListUrl: { type: String },
    sitePlanUrl: { type: String },
    layoutPlanUrl: { type: String },

    isFeatured: { type: Boolean, default: false },
    isPromoted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Clear the model from cache to force schema update in development
if (mongoose.models.Property) {
  delete mongoose.models.Property;
}

const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;
