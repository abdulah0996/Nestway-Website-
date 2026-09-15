import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AdminAuthProvider } from '../admin/context/AdminAuthContext.jsx';

export function AppProviders({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
      mutations: { retry: 0 },
    },
  }));
  return <QueryClientProvider client={queryClient}><AdminAuthProvider>{children}</AdminAuthProvider></QueryClientProvider>;
}
