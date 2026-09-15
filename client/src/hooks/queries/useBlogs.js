import { useQuery } from '@tanstack/react-query';
import { getBlog, getBlogs } from '../../services/api/blogs.js';

export function useBlogs(params) {
  return useQuery({ queryKey: ['blogs', params], queryFn: () => getBlogs(params) });
}

export function useBlog(slug) {
  return useQuery({ queryKey: ['blogs', slug], queryFn: () => getBlog(slug), enabled: Boolean(slug) });
}
