import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import { NDKProvider } from '@libs/ndk/provider';
import { StorageProvider } from '@libs/storage/provider';

import App from './app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{
      persister,
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => {
          if (query.queryKey !== 'widgets') return true;
        },
      },
    }}
  >
    <StorageProvider>
      <NDKProvider>
        <Toaster position="top-center" closeButton />
        <App />
      </NDKProvider>
    </StorageProvider>
  </PersistQueryClientProvider>
);
