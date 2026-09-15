import mongoose from 'mongoose';
import { addressSchema, emailValidator, objectId, timestamps } from './common.js';

const officeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    address: { type: addressSchema, required: true },
    phone: { type: String, required: true, trim: true },
    email: emailValidator,
    timezone: { type: String, required: true, trim: true },
    openingHours: [{ day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required: true }, open: String, close: String, isClosed: { type: Boolean, default: false } }],
    mapUrl: { type: String, trim: true },
    consultants: [objectId('User')],
    isPublished: { type: Boolean, default: true },
  },
  timestamps,
);

export default mongoose.model('Office', officeSchema);
