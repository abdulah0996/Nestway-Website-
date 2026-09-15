import mongoose from 'mongoose';
import { objectId, timestamps } from './common.js';

const adminActivitySchema = new mongoose.Schema(
  {
    adminUser: { ...objectId('AdminUser'), required: true },
    action: { type: String, required: true, trim: true, maxlength: 120 },
    module: { type: String, required: true, trim: true, lowercase: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String, trim: true },
  },
  timestamps,
);

adminActivitySchema.index({ adminUser: 1, createdAt: -1 });
adminActivitySchema.index({ module: 1, createdAt: -1 });

export default mongoose.model('AdminActivity', adminActivitySchema);
