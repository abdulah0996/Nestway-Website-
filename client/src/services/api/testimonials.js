import { apiClient, unwrap } from '../apiClient.js';
export const getTestimonials = (params) => unwrap(apiClient.get('/testimonials', { params }));
