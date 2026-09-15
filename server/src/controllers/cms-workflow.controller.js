import Blog from '../models/blog.model.js';
import Service from '../models/service.model.js';
import Testimonial from '../models/testimonial.model.js';
import { ApiError } from '../services/resource.service.js';

async function updateOr404(Model, id, update) {
  const item = await Model.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, `${Model.modelName} not found`);
  return item;
}

export async function setServicePublication(request, response, next) {
  try {
    if (typeof request.body.isPublished !== 'boolean') throw new ApiError(400, 'isPublished must be a boolean');
    const data = await updateOr404(Service, request.params.id, { isPublished: request.body.isPublished, updatedBy: request.user.sub });
    response.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function setBlogStatus(request, response, next) {
  try {
    const { status } = request.body;
    if (!['draft', 'published'].includes(status)) throw new ApiError(400, 'status must be draft or published');
    const data = await updateOr404(Blog, request.params.id, { status, publishedAt: status === 'published' ? new Date() : null });
    response.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function updateBlogSeo(request, response, next) {
  try {
    const allowed = ['metaTitle', 'metaDescription', 'keywords'];
    const seo = Object.fromEntries(Object.entries(request.body).filter(([key]) => allowed.includes(key)));
    if (Object.keys(seo).length === 0) throw new ApiError(400, 'At least one SEO field is required');
    const data = await updateOr404(Blog, request.params.id, { seo });
    response.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function approveTestimonial(request, response, next) {
  try {
    const data = await updateOr404(Testimonial, request.params.id, { approvedBy: request.user.sub });
    response.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function publishTestimonial(request, response, next) {
  try {
    const testimonial = await Testimonial.findById(request.params.id);
    if (!testimonial) throw new ApiError(404, 'Testimonial not found');
    if (!testimonial.approvedBy) throw new ApiError(400, 'Testimonial must be approved before publishing');
    testimonial.isPublished = true;
    await testimonial.save();
    response.json({ success: true, data: testimonial });
  } catch (error) { next(error); }
}
