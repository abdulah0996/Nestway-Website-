import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nestway_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject({
    status: error.response?.status,
    message: error.response?.data?.message || error.message || 'Something went wrong',
    errors: error.response?.data?.errors,
  }),
);

export async function unwrap(request) {
  const response = await request;
  return response.data?.data ?? response.data;
}
