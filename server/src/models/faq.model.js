import mongoose from 'mongoose';
import { objectId, timestamps } from './common.js';

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 300 },
    answer: { type: String, required: true, trim: true, maxlength: 2000 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    service: objectId('Service'),
    country: objectId('Country'),
    displayOrder: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false },
    createdBy: objectId('AdminUser'),
    updatedBy: objectId('AdminUser'),
  },
  timestamps,
);

faqSchema.index({ category: 1, displayOrder: 1 });
export default mongoose.model('FAQ', faqSchema);
