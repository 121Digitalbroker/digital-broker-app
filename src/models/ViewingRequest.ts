import mongoose, { Schema, Document } from 'mongoose';

export interface IViewingRequest extends Document {
  name: string;
  phone: string;
  email?: string;
  preferredDate: string;
  preferredTime: string;
  propertyId?: string;
  propertyName?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const ViewingRequestSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: false },
  preferredDate: { type: String, required: true },
  preferredTime: { type: String, required: true },
  propertyId: { type: String, required: false },
  propertyName: { type: String, required: false },
  message: { type: String, required: false },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
}, {
  timestamps: true
});

export default mongoose.models.ViewingRequest || mongoose.model<IViewingRequest>('ViewingRequest', ViewingRequestSchema);
