import mongoose from 'mongoose';
import { objectId, timestamps } from './common.js';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, trim: true, maxlength: 120 },
    content: { type: String, required: true, trim: true, maxlength: 1200 },
    photoUrl: { type: String, trim: true },
    country: { type: String, trim: true },
    service: objectId('Service'),
    rating: { type: Number, required: true, min: 1, max: 5 },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0, min: 0 },
    approvedBy: objectId('AdminUser'),
  },
  timestamps,
);

export default mongoose.model('Testimonial', testimonialSchema);
