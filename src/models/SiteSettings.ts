import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  siteTitle: string;
  siteDescription: string;
  keywords: string; // Comma separated
  googleVerification?: string;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema({
  siteTitle: { type: String, default: 'Digital Broker | Premium Real Estate' },
  siteDescription: { type: String, default: 'Find exclusive homes and commercial properties with expert guidance.' },
  keywords: { type: String, default: 'Real Estate, Noida, Yamuna Expressway, Digital Broker' },
  googleVerification: { type: String, default: 'google5ea580b37fc40bfa' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
