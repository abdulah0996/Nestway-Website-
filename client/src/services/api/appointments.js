import { apiClient, unwrap } from '../apiClient.js';
export const createAppointment = (payload) => unwrap(apiClient.post('/appointments', payload));
