import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

import { NDKProvider } from '@libs/ndk/provider';
import { getSetting } from '@libs/storage';
import { StorageProvider } from '@libs/storage/provider';

import App from './app';

const cacheTime = await getSetting('cache_time');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: parseInt(cacheTime),
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <StorageProvider>
      <NDKProvider>
        <App />
      </NDKProvider>
    </StorageProvider>
  </QueryClientProvider>
);
