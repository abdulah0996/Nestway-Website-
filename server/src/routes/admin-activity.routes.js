import { Router } from 'express';
import { listAdminActivities } from '../controllers/admin-activity.controller.js';
import { requireAuth, requirePermission } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', requireAuth, requirePermission('audit:view'), listAdminActivities);
export default router;
