import mongoose from 'mongoose';
import { objectId, seoSchema, slugValidator, timestamps } from './common.js';

const countrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, maxlength: 100 },
    code: { type: String, required: true, trim: true, uppercase: true, unique: true, minlength: 2, maxlength: 3 },
    slug: slugValidator,
    flagUrl: { type: String, trim: true },
    overview: { type: String, trim: true },
    popularServices: [objectId('Service')],
    universities: [objectId('University')],
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0, min: 0 },
    seo: seoSchema,
  },
  timestamps,
);

export default mongoose.model('Country', countrySchema);