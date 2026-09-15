import { apiClient, unwrap } from '../apiClient.js';
export const createLead = (payload) => unwrap(apiClient.post('/leads', payload));
