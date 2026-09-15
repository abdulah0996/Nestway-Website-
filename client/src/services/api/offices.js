import { apiClient, unwrap } from '../apiClient.js';

export const getOffices = (params) => unwrap(apiClient.get('/offices', { params }));
