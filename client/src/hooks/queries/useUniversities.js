import { useQuery } from '@tanstack/react-query';
import { getUniversities } from '../../services/api/universities.js';

export function useUniversities(params) {
  return useQuery({ queryKey: ['universities', params], queryFn: () => getUniversities(params) });
}
