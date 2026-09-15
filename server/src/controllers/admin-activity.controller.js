import AdminActivity from '../models/admin-activity.model.js';

export async function listAdminActivities(request, response, next) {
  try {
    const filter = {};
    if (request.query.module) filter.module = request.query.module;
    if (request.query.adminUser) filter.adminUser = request.query.adminUser;
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 20, 1), 100);
    const [items, total] = await Promise.all([
      AdminActivity.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('adminUser', 'firstName lastName email role'),
      AdminActivity.countDocuments(filter),
    ]);
    response.json({ success: true, data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch (error) { next(error); }
}
