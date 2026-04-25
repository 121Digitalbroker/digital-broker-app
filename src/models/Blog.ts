import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  keywords: string[];
  relatedProperties: mongoose.Types.ObjectId[];
  author: string;
  status: 'Draft' | 'Published';
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    thumbnail: { type: String }, // Made optional for quick drafts
    keywords: [{ type: String }],
    relatedProperties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
    author: { type: String, default: 'Digital Broker Expert' }, // E-E-A-T
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
  },
  { timestamps: true }
);

// Pre-save hook to generate SEO friendly slug automatically
BlogSchema.pre('save', function (this: any) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

// Clear the model from cache to force schema update in development
if (mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
