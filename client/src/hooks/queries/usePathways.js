import { useQuery } from '@tanstack/react-query';
import { getPathways } from '../../services/api/pathways.js';

export function usePathways(params, options = {}) {
  return useQuery({ queryKey: ['pathways', params], queryFn: () => getPathways(params), ...options });
}
