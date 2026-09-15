import { recordAdminActivity } from '../services/audit.service.js';

export function auditAction(action, module, describe) {
  return (request, response, next) => {
    response.on('finish', () => {
      if (response.statusCode < 200 || response.statusCode >= 400) return;
      const description = typeof describe === 'function'
        ? describe(request)
        : `${request.user?.role || 'Admin'} ${action} ${module}`;
      void recordAdminActivity({
        request,
        action,
        module,
        description,
        resourceId: response.locals.auditResourceId || request.params.id,
        metadata: { method: request.method, path: request.originalUrl },
      }).catch((error) => console.error(`Audit log failed: ${error.message}`));
    });
    next();
  };
}
