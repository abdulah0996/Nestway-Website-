import { apiClient, unwrap } from '../apiClient.js';

export const getPathways = (params) => unwrap(apiClient.get('/pathways', { params }));
