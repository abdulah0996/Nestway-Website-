import { apiClient, unwrap } from '../apiClient.js';

export const getTeamMembers = (params) => unwrap(apiClient.get('/team-members', { params }));
