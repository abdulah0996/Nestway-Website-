import { useQuery } from '@tanstack/react-query';
import { getTestimonials } from '../../services/api/testimonials.js';

export function useTestimonials(params) {
  return useQuery({ queryKey: ['testimonials', params], queryFn: () => getTestimonials(params) });
}
