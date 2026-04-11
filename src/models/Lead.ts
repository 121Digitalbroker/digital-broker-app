import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email?: string;
  phone: string;
  message?: string;
  source: 'chat' | 'enquiry' | 'document_download' | string;
  propertyId?: string;
  propertyTitle?: string;
  documentType?: string;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    message: { type: String },
    source: { type: String, default: 'chat' },
    propertyId: { type: String },
    propertyTitle: { type: String },
    documentType: { type: String },
  },
  { timestamps: true }
);

const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
