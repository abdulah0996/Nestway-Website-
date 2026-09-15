import mongoose from 'mongoose';
import { objectId, seoSchema, slugValidator, timestamps } from './common.js';

const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 180 },
    slug: slugValidator,
    country: { ...objectId('Country'), required: true },
    city: { type: String, required: true, trim: true },
    websiteUrl: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
    description: { type: String, trim: true },
    ranking: { type: Number, min: 1 },
    studyLevels: [{ type: String, enum: ['foundation', 'undergraduate', 'postgraduate', 'doctorate'] }],
    popularPrograms: [{ type: String, trim: true }],
    tuitionRange: { min: { type: Number, min: 0 }, max: { type: Number, min: 0 }, currency: { type: String, trim: true, uppercase: true } },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    seo: seoSchema,
  },
  timestamps,
);

universitySchema.index({ country: 1, isPublished: 1 });
export default mongoose.model('University', universitySchema);
