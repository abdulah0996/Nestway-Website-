import { Router } from 'express';
import { requireAuth, requirePermission } from '../middleware/auth.middleware.js';
import { requireBodyFields } from '../middleware/validate.middleware.js';
import { createResourceController } from '../controllers/resource.controller.js';
import { createResourceService } from '../services/resource.service.js';
import { auditAction } from '../middleware/audit.middleware.js';

export function createCrudRouter({ Model, requiredFields = [], slug = true, populate, buildFilter, permission = 'cms:manage' }) {
  const router = Router();
  const service = createResourceService(Model);
  const controller = createResourceController(service, { slugField: slug, populate, buildFilter });
  const getPath = slug ? '/:slug' : '/:id';

  router.get('/', controller.list);
  router.get(getPath, controller.getOne);
  const canManage = requirePermission(permission);
  const module = Model.modelName.toLowerCase();
  router.post('/', requireAuth, canManage, requireBodyFields(...requiredFields), auditAction('created', module), controller.create);
  router.put('/:id', requireAuth, canManage, auditAction('updated', module), controller.update);
  router.delete('/:id', requireAuth, canManage, auditAction('deleted', module), controller.remove);

  return router;
}
