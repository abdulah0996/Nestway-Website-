import mongoose from 'mongoose';
import { objectId, seoSchema, slugValidator, timestamps } from './common.js';

const immigrationPathwaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    slug: slugValidator,
    country: { ...objectId('Country'), required: true },
    service: { ...objectId('Service'), required: true },
    description: { type: String, required: true, trim: true },
    eligibilityCriteria: [{ type: String, required: true, trim: true }],
    requiredDocuments: [{ type: String, trim: true }],
    processingTime: { type: String, trim: true },
    estimatedCost: { type: String, trim: true },
    difficulty: { type: String, enum: ['low', 'medium', 'high'] },
    isPublished: { type: Boolean, default: false },
    seo: seoSchema,
    createdBy: objectId('AdminUser'),
    updatedBy: objectId('AdminUser'),
  },
  timestamps,
);

immigrationPathwaySchema.index({ country: 1, service: 1 });
export default mongoose.model('ImmigrationPathway', immigrationPathwaySchema);