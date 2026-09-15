import Testimonial from '../models/testimonial.model.js';
import { createCrudRouter } from './resource.routes.js';
import { approveTestimonial, publishTestimonial } from '../controllers/cms-workflow.controller.js';
import { auditAction } from '../middleware/audit.middleware.js';
import { requireAuth, requirePermission } from '../middleware/auth.middleware.js';

const router = createCrudRouter({
  Model: Testimonial,
  requiredFields: ['name', 'content', 'rating'],
  slug: false,
  populate: ['service'],
});

router.patch('/:id/approve', requireAuth, requirePermission('testimonials:manage'), auditAction('approved', 'testimonials'), approveTestimonial);
router.patch('/:id/publish', requireAuth, requirePermission('testimonials:manage'), auditAction('published', 'testimonials'), publishTestimonial);
export default router;
