import { apiClient, unwrap } from '../apiClient.js';
export const getCountries = (params) => unwrap(apiClient.get('/countries', { params }));
export const getCountry = (slug) => unwrap(apiClient.get(`/countries/${slug}`));
