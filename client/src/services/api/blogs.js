import { apiClient, unwrap } from '../apiClient.js';
export const getBlogs = (params) => unwrap(apiClient.get('/blogs', { params }));
export const getBlog = (slug) => unwrap(apiClient.get(`/blogs/${slug}`));
