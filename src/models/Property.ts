import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResidentialConfig {
  typology: '2BHK' | '3BHK' | '4BHK' | '5BHK';
  unitSize: number;
  pricePerSqft: number;
  // Furnishing Type
  furnishingType?: 'Unfurnished' | 'Semi Furnished' | 'Fully Furnished';
  fullyFurnishedPriceSqft?: number;
  // Per SqFt charges
  plcPerSqft?: number;
  plcElements?: { name: string; price: number }[];
  otherChargesPerSqft?: number;
  // Existing fields
  priceRangeMin?: number;
  priceRangeMax?: number;
  plcCharges?: number;
  otherCharges?: number;
  // Possession - Year or RERA
  possessionYear?: string;
  reraLink?: string;
  ticketSize: number;
  sitePlanUrl?: string;
  layoutImages?: string[];
  // Room details
  servantRooms?: 1 | 2 | 3 | 4 | 5 | 6;
  toilets?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  balconies?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  // Additional features
  carParking?: 'Included' | 'Not Included';
  parkingPrice?: number;
  clubMembership?: 'Included' | 'Not Included' | 'Optional';
  clubMembershipPrice?: number;
}

export interface ICommercialConfig {
  commercialType: 'Business Suite' | 'Gaming Zone' | 'Fine Dining' | 'Serviced Apartment' | 'Office Spaces';
  unitSize: number;
  pricePerSqft: number;
  leaseYears?: number;
  assuredReturnPct?: number;
  preLeased: boolean;
  isLockable?: boolean;
  mlgPrice?: number;
  assuredReturnMonthly?: boolean;
  ticketSize: number;
  layoutImages?: string[];
}

export interface INearbyLocation {
  name: string;
  distance: string;
}

export interface IProperty extends Document {
  // Section 1 — Developer
  developerName: string;
  developerLogo?: string;
  keywords?: string; // SEO Keywords

  // Section 2 — Project
  projectName: string;
  city: 'Noida' | 'Greater Noida' | 'Noida Extension' | 'Yamuna Expressway';
  sector?: string;
  projectSize?: number;
  reraNumber?: string;
  projectStatus?: 'Pre Launch' | 'New Launch' | 'Under Construction' | 'Ready To Move';
  totalTowers?: number;

  // Loanable option - Project level
  loanable?: 'YES' | 'NO' | 'PARTIAL' | 'SELECTIVE BANKS ONLY';

  // Nearby Locations (Strategic Location)
  nearbyLocations?: INearbyLocation[];

  // Section 3 — Type
  propertyType: 'residential' | 'commercial' | 'both';

  // Section 4 — Residential Configs
  residentialConfigs?: IResidentialConfig[];

  // Section 5 — Commercial Configs
  commercialConfigs?: ICommercialConfig[];

  // Section 6 — Documents
  productImages?: string[];
  morePhotos?: string[];
  brochureUrl?: string;
  priceListUrl?: string;
  sitePlanUrl?: string;
  googleMapsUrl?: string;

  // Additional Details
  aboutProject?: string;
  amenities?: string[];

  // Metadata for listing compatibility
  isFeatured: boolean;
  isPromoted: boolean;
  showOnYamunaExpressway: boolean;
  isVisible: boolean;
  furnishingType: 'Semi Furnished' | 'Fully Furnished' | 'Unfurnished';
  createdAt: Date;
  updatedAt: Date;
}

const ResidentialConfigSchema = new Schema<IResidentialConfig>({
  typology: { type: String, enum: ['2BHK', '3BHK', '4BHK', '5BHK'], required: true },
  unitSize: { type: Number, required: true },
  pricePerSqft: { type: Number, required: true },
  // Furnishing Type
  furnishingType: { type: String, enum: ['Unfurnished', 'Semi Furnished', 'Fully Furnished'] },
  fullyFurnishedPriceSqft: { type: Number },
  // Per SqFt charges
  plcPerSqft: { type: Number },
  plcElements: [{
    name: { type: String },
    price: { type: Number }
  }],
  layoutImages: [{ type: String }],
  otherChargesPerSqft: { type: Number },
  // Existing fields
  priceRangeMin: { type: Number },
  priceRangeMax: { type: Number },
  plcCharges: { type: Number },
  otherCharges: { type: Number },
  // Possession - Year or RERA
  possessionYear: { type: String },
  reraLink: { type: String },
  ticketSize: { type: Number, required: true },
  sitePlanUrl: { type: String },
  // Room details
  servantRooms: { type: Number, enum: [1, 2, 3, 4, 5, 6] },
  toilets: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  balconies: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  // Additional features
  carParking: { type: String, enum: ['Included', 'Not Included'] },
  parkingPrice: { type: Number },
  clubMembership: { type: String, enum: ['Included', 'Not Included', 'Optional'] },
  clubMembershipPrice: { type: Number },
});

const CommercialConfigSchema = new Schema<ICommercialConfig>({
  commercialType: { type: String, enum: ['Business Suite', 'Gaming Zone', 'Fine Dining', 'Serviced Apartment', 'Office Spaces'], required: true },
  unitSize: { type: Number, required: true },
  pricePerSqft: { type: Number, required: true },
  leaseYears: { type: Number },
  assuredReturnPct: { type: Number },
  preLeased: { type: Boolean, default: false },
  isLockable: { type: Boolean, default: true },
  mlgPrice: { type: Number },
  assuredReturnMonthly: { type: Boolean, default: false },
  ticketSize: { type: Number, required: true },
  layoutImages: [{ type: String }],
});

const PropertySchema = new Schema<IProperty>(
  {
    developerName: { type: String, required: true },
    developerLogo: { type: String },
    keywords: { type: String },

    projectName: { type: String, required: true },
    city: { type: String, enum: ['Noida', 'Greater Noida', 'Noida Extension', 'Yamuna Expressway'], required: true },
    sector: { type: String },
    projectSize: { type: Number },
    reraNumber: { type: String },
    projectStatus: { type: String, enum: ['Pre Launch', 'New Launch', 'Under Construction', 'Ready To Move'] },
    totalTowers: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9] },

    // Loanable option - Project level
    loanable: { type: String, enum: ['YES', 'NO', 'PARTIAL', 'SELECTIVE BANKS ONLY'], default: 'NO' },

    // Nearby Locations (Strategic Location)
    nearbyLocations: [{
      name: { type: String, required: true },
      distance: { type: String, required: true },
    }],

    propertyType: { type: String, enum: ['residential', 'commercial', 'both'], required: true },

    residentialConfigs: [ResidentialConfigSchema],
    commercialConfigs: [CommercialConfigSchema],

    productImages: [{ type: String }],
    morePhotos: [{ type: String }],
    brochureUrl: { type: String },
    priceListUrl: { type: String },
    sitePlanUrl: { type: String },
    googleMapsUrl: { type: String },

    aboutProject: { type: String },
    amenities: [{ type: String }],

    isFeatured: { type: Boolean, default: false },
    isPromoted: { type: Boolean, default: false },
    showOnYamunaExpressway: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
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
