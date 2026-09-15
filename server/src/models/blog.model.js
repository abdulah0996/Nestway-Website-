import mongoose from 'mongoose';
import { objectId, seoSchema, slugValidator, timestamps } from './common.js';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: slugValidator,
    excerpt: { type: String, required: true, trim: true, maxlength: 400 },
    content: { type: String, required: true, trim: true },
    coverImageUrl: { type: String, trim: true },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: { ...objectId('AdminUser'), required: true },
    status: { type: String, enum: ['draft', 'review', 'published', 'archived'], default: 'draft' },
    publishedAt: { type: Date },
    readingTimeMinutes: { type: Number, min: 1 },
    seo: seoSchema,
  },
  timestamps,
);

blogSchema.index({ status: 1, publishedAt: -1 });
export default mongoose.model('Blog', blogSchema);
