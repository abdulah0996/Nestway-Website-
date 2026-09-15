import mongoose from 'mongoose';
import { objectId, timestamps } from './common.js';

const mediaAssetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 180 },
    type: { type: String, required: true, enum: ['image', 'logo', 'document'] },
    url: { type: String, required: true, trim: true },
    storageKey: { type: String, trim: true, index: true },
    storageProvider: { type: String, trim: true, default: 'external' },
    mimeType: { type: String, trim: true },
    sizeBytes: { type: Number, min: 0 },
    altText: { type: String, trim: true, maxlength: 300 },
    metadata: { type: mongoose.Schema.Types.Mixed },
    uploadedBy: { ...objectId('AdminUser'), required: true },
  },
  timestamps,
);

mediaAssetSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model('MediaAsset', mediaAssetSchema);
