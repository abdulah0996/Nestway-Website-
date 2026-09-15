import { useQuery } from '@tanstack/react-query';
import { getCountries, getCountry } from '../../services/api/countries.js';

export function useCountries(params) { return useQuery({ queryKey: ['countries', params], queryFn: () => getCountries(params) }); }
export function useCountry(slug) { return useQuery({ queryKey: ['countries', slug], queryFn: () => getCountry(slug), enabled: Boolean(slug) }); }
