import { useQuery } from '@tanstack/react-query';
import { getFaqs } from '../../services/api/faqs.js';

export function useFaqs(params) {
  return useQuery({ queryKey: ['faqs', params], queryFn: () => getFaqs(params) });
}
