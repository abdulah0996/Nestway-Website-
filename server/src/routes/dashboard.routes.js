import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
import { requireAuth, requirePermission } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', requireAuth, requirePermission('dashboard:view'), getDashboard);
export default router;
