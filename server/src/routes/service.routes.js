import Service from '../models/service.model.js';
import { createCrudRouter } from './resource.routes.js';
import { setServicePublication } from '../controllers/cms-workflow.controller.js';
import { auditAction } from '../middleware/audit.middleware.js';
import { requireAuth, requirePermission } from '../middleware/auth.middleware.js';

const router = createCrudRouter({
  Model: Service,
  requiredFields: ['name', 'slug', 'shortDescription', 'description', 'category'],
  populate: ['countries', 'relatedPathways'],
  permission: 'services:manage',
});

router.patch('/:id/publication', requireAuth, requirePermission('services:manage'), auditAction('publication_updated', 'services'), setServicePublication);
export default router;
