import AdminActivity from '../models/admin-activity.model.js';

export async function recordAdminActivity({ request, action, module, description, resourceId, metadata }) {
  if (!request.user?.sub || request.user.accountType !== 'admin') return null;
  return AdminActivity.create({
    adminUser: request.user.sub,
    action,
    module,
    description,
    resourceId,
    metadata,
    ipAddress: request.ip,
  });
}
