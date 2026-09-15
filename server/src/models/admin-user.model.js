import mongoose from 'mongoose';
import { emailValidator, objectId, timestamps } from './common.js';

const adminUserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { ...emailValidator, unique: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'consultant'], default: 'consultant' },
    permissions: [{ type: String, trim: true }],
    avatarUrl: { type: String, trim: true },
    lastLoginAt: { type: Date },
    createdBy: objectId('AdminUser'),
    isActive: { type: Boolean, default: true },
  },
  timestamps,
);

export default mongoose.model('AdminUser', adminUserSchema);
