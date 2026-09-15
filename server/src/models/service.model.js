import mongoose from 'mongoose';
import { objectId, seoSchema, slugValidator, timestamps } from './common.js';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    slug: slugValidator,
    shortDescription: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, required: true, trim: true },
    iconUrl: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    category: { type: String, enum: ['study', 'work', 'business', 'family', 'visitor', 'settlement'], required: true },
    countries: [objectId('Country')],
    relatedPathways: [objectId('ImmigrationPathway')],
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0, min: 0 },
    seo: seoSchema,
    createdBy: objectId('AdminUser'),
    updatedBy: objectId('AdminUser'),
  },
  timestamps,
);

serviceSchema.index({ isPublished: 1, displayOrder: 1 });
export default mongoose.model('Service', serviceSchema);