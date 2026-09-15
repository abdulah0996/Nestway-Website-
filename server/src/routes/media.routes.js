import { Router } from 'express';
import { createMedia, deleteMedia, listMedia, updateMedia } from '../controllers/media.controller.js';
import { auditAction } from '../middleware/audit.middleware.js';
import { requireAuth, requirePermission } from '../middleware/auth.middleware.js';
import { requireBodyFields, validateEnum } from '../middleware/validate.middleware.js';

const router = Router();
router.use(requireAuth, requirePermission('media:manage'));
router.get('/', listMedia);
router.post('/', requireBodyFields('name', 'type', 'url'), validateEnum('type', ['image', 'logo', 'document']), auditAction('created', 'media'), createMedia);
router.patch('/:id', auditAction('updated', 'media'), updateMedia);
router.delete('/:id', auditAction('deleted', 'media'), deleteMedia);
export default router;
