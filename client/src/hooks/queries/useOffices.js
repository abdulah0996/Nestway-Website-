import { useQuery } from '@tanstack/react-query';
import { getOffices } from '../../services/api/offices.js';

export function useOffices(params) {
  return useQuery({ queryKey: ['offices', params], queryFn: () => getOffices(params) });
}
