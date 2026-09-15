import Blog from '../models/blog.model.js';
import { createCrudRouter } from './resource.routes.js';
import { setBlogStatus, updateBlogSeo } from '../controllers/cms-workflow.controller.js';
import { auditAction } from '../middleware/audit.middleware.js';
import { requireAuth, requirePermission } from '../middleware/auth.middleware.js';

const router = createCrudRouter({
  Model: Blog,
  requiredFields: ['title', 'slug', 'excerpt', 'content', 'category', 'author'],
  populate: ['author'],
  buildFilter: (request) => request.path === '/' ? { status: 'published' } : {},
  buildOneFilter: () => ({ status: 'published' }),
  permission: 'blogs:manage',
});

router.patch('/:id/status', requireAuth, requirePermission('blogs:manage'), auditAction('status_updated', 'blogs'), setBlogStatus);
router.patch('/:id/seo', requireAuth, requirePermission('blogs:manage'), auditAction('seo_updated', 'blogs'), updateBlogSeo);
export default router;
