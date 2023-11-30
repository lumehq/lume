import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import { NDKProvider } from '@libs/ndk/provider';
import { StorageProvider } from '@libs/storage/provider';

import App from './app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      queries: {
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // 10 seconds
      },
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <Toaster position="top-center" theme="system" closeButton />
    <StorageProvider>
      <NDKProvider>
        <App />
      </NDKProvider>
    </StorageProvider>
  </QueryClientProvider>
);
