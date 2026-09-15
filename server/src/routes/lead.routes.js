import { Router } from 'express';
import { requireAnyPermission, requireAuth, requirePermission } from '../middleware/auth.middleware.js';
import { requireBodyFields, validateQueryEnum } from '../middleware/validate.middleware.js';
import { assignLeadToAdviser, changeLeadStatus, createEnquiry, createLeadNote, getLeads, scheduleLeadFollowUp } from '../controllers/lead.controller.js';
import { auditAction } from '../middleware/audit.middleware.js';

const router = Router();
router.post('/', requireBodyFields('firstName', 'lastName', 'email', 'consentToContact'), createEnquiry);
router.get('/', requireAuth, requireAnyPermission('leads:manage', 'leads:view_assigned'), validateQueryEnum('status', ['new', 'contacted', 'follow_up', 'documents_pending', 'application_started', 'submitted', 'approved', 'rejected']), getLeads);
router.patch('/:id/status', requireAuth, requireAnyPermission('leads:manage', 'leads:update_assigned'), requireBodyFields('status'), auditAction('status_updated', 'leads'), changeLeadStatus);
router.patch('/:id/assign', requireAuth, requirePermission('leads:manage'), auditAction('assigned', 'leads'), assignLeadToAdviser);
router.post('/:id/notes', requireAuth, requireAnyPermission('leads:manage', 'leads:notes_assigned'), requireBodyFields('body'), auditAction('note_added', 'leads'), createLeadNote);
router.patch('/:id/follow-up', requireAuth, requireAnyPermission('leads:manage', 'leads:update_assigned'), auditAction('follow_up_updated', 'leads'), scheduleLeadFollowUp);

export default router;
