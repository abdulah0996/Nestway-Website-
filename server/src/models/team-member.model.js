import mongoose from 'mongoose';
import { objectId, timestamps } from './common.js';

const teamMemberSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    jobTitle: { type: String, required: true, trim: true, maxlength: 120 },
    bio: { type: String, required: true, trim: true, maxlength: 1500 },
    photoUrl: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'] },
    specialties: [{ type: String, trim: true }],
    languages: [{ type: String, trim: true }],
    linkedUser: objectId('User'),
    displayOrder: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false },
  },
  timestamps,
);

export default mongoose.model('TeamMember', teamMemberSchema);
