import mongoose from 'mongoose';
import { emailValidator, objectId, timestamps } from './common.js';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { ...emailValidator, unique: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['client', 'consultant', 'admin'], default: 'client' },
    phone: { type: String, trim: true },
    countryOfResidence: { type: String, trim: true },
    preferredContactMethod: { type: String, enum: ['email', 'phone', 'whatsapp'], default: 'email' },
    isActive: { type: Boolean, default: true },
    assignedConsultant: objectId('User'),
  },
  timestamps,
);

export default mongoose.model('User', userSchema);
