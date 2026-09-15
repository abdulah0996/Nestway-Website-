import { Router } from 'express';
import { requireAuth, requirePermission } from '../middleware/auth.middleware.js';
import { requireBodyFields, validateQueryEnum } from '../middleware/validate.middleware.js';
import { assignConsultant, bookAppointment, changeAppointmentStatus, getAppointments } from '../controllers/appointment.controller.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();
router.post('/', requireBodyFields('lead', 'scheduledAt', 'durationMinutes', 'timezone', 'meetingType'), bookAppointment);
router.get('/', requireAuth, requirePermission('appointments:manage'), validateQueryEnum('status', ['pending', 'confirmed', 'completed', 'cancelled']), getAppointments);
router.patch('/:id/status', requireAuth, requirePermission('appointments:manage'), requireBodyFields('status'), auditAction('status_updated', 'appointments'), changeAppointmentStatus);
router.patch('/:id/assign', requireAuth, requirePermission('appointments:manage'), requireBodyFields('consultant'), auditAction('assigned', 'appointments'), assignConsultant);

export default router;
