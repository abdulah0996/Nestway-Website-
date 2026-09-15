import { apiClient, unwrap } from '../apiClient.js';
export const getServices = (params) => unwrap(apiClient.get('/services', { params }));
export const getService = (slug) => unwrap(apiClient.get(`/services/${slug}`));
