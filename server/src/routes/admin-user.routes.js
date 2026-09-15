import { Router } from 'express';
import { createAdminUser, listAdminUsers, updateAdminUser } from '../controllers/admin-user.controller.js';
import { requireAuth, requirePermission, requireRoles } from '../middleware/auth.middleware.js';
import { requireBodyFields } from '../middleware/validate.middleware.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', requirePermission('admin_users:view'), listAdminUsers);
router.post('/', requireRoles('admin'), requireBodyFields('firstName', 'lastName', 'email', 'password', 'role'), auditAction('created', 'admin_users'), createAdminUser);
router.patch('/:id', requireRoles('admin'), auditAction('updated', 'admin_users'), updateAdminUser);

export default router;
