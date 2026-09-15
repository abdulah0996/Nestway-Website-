import { useQuery } from '@tanstack/react-query';
import { getTeamMembers } from '../../services/api/team.js';

export function useTeamMembers(params) {
  return useQuery({ queryKey: ['team-members', params], queryFn: () => getTeamMembers(params) });
}
