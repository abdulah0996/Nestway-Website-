import { apiClient, unwrap } from '../apiClient.js';

export const getFaqs = (params) => unwrap(apiClient.get('/faqs', { params }));
