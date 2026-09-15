import { useQuery } from '@tanstack/react-query';
import { getService, getServices } from '../../services/api/services.js';

export const serviceKeys = { all: ['services'], detail: (slug) => ['services', slug] };
export function useServices(params) { return useQuery({ queryKey: [...serviceKeys.all, params], queryFn: () => getServices(params) }); }
export function useService(slug) { return useQuery({ queryKey: serviceKeys.detail(slug), queryFn: () => getService(slug), enabled: Boolean(slug) }); }
