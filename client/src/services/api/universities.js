import { apiClient, unwrap } from '../apiClient.js';
export const getUniversities = (params) => unwrap(apiClient.get('/universities', { params }));
export const getUniversity = (slug) => unwrap(apiClient.get(`/universities/${slug}`));
