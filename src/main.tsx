import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createRoot } from 'react-dom/client';

import { getSetting } from '@libs/storage';

import { RelayProvider } from '@shared/relayProvider';

import App from './app';

const cacheTime = await getSetting('cache_time');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: parseInt(cacheTime),
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
    <RelayProvider>
      <App />
    </RelayProvider>
    <ReactQueryDevtools initialIsOpen={false} position="top-right" />
  </PersistQueryClientProvider>
);
