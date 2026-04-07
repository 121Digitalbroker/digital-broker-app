import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IYamunaBanner extends Document {
  image: string;
  title: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const YamunaBannerSchema = new Schema<IYamunaBanner>(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Clear model cache in dev
if (mongoose.models.YamunaBanner) {
  delete mongoose.models.YamunaBanner;
}

const YamunaBanner: Model<IYamunaBanner> =
  mongoose.models.YamunaBanner || mongoose.model<IYamunaBanner>('YamunaBanner', YamunaBannerSchema);

export default YamunaBanner;
