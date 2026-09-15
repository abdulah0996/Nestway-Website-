import MediaAsset from '../models/media-asset.model.js';
import { ApiError } from '../services/resource.service.js';

export async function listMedia(request, response, next) {
  try {
    const filter = request.query.type ? { type: request.query.type } : {};
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 20, 1), 100);
    const [items, total] = await Promise.all([
      MediaAsset.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('uploadedBy', 'firstName lastName email'),
      MediaAsset.countDocuments(filter),
    ]);
    response.json({ success: true, data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch (error) { next(error); }
}

export async function createMedia(request, response, next) {
  try {
    const data = await MediaAsset.create({ ...request.body, uploadedBy: request.user.sub });
    response.status(201).json({ success: true, data });
  } catch (error) { next(error); }
}

export async function updateMedia(request, response, next) {
  try {
    const allowed = ['name', 'url', 'storageKey', 'storageProvider', 'mimeType', 'sizeBytes', 'altText', 'metadata'];
    const update = Object.fromEntries(Object.entries(request.body).filter(([key]) => allowed.includes(key)));
    const data = await MediaAsset.findByIdAndUpdate(request.params.id, update, { new: true, runValidators: true });
    if (!data) throw new ApiError(404, 'Media asset not found');
    response.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function deleteMedia(request, response, next) {
  try {
    const data = await MediaAsset.findByIdAndDelete(request.params.id);
    if (!data) throw new ApiError(404, 'Media asset not found');
    response.status(204).send();
  } catch (error) { next(error); }
}
