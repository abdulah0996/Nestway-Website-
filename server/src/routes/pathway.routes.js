import { Router } from 'express';
import ImmigrationPathway from '../models/immigration-pathway.model.js';
import { requireAuth, requirePermission } from '../middleware/auth.middleware.js';
import { requireBodyFields } from '../middleware/validate.middleware.js';
import { createResourceController } from '../controllers/resource.controller.js';
import { createResourceService } from '../services/resource.service.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();
const service = createResourceService(ImmigrationPathway);
const controller = createResourceController(service, {
	populate: ['country', 'service'],
	buildFilter: (request) => request.query.country ? { country: request.query.country } : {},
});
const canManage = requirePermission('pathways:manage');

router.get('/', controller.list);
router.get('/country/:countryId', (request, response, next) => controller.list({ ...request, query: { ...request.query, country: request.params.countryId } }, response, next));
router.get('/:slug', controller.getOne);
router.post('/', requireAuth, canManage, requireBodyFields('name', 'slug', 'country', 'service', 'description'), auditAction('created', 'pathways'), controller.create);
router.put('/:id', requireAuth, canManage, auditAction('updated', 'pathways'), controller.update);
router.delete('/:id', requireAuth, canManage, auditAction('deleted', 'pathways'), controller.remove);

export default router;
