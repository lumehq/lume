import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { ArkProvider } from '@libs/ark/provider';
import App from './app';
import './app.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // 10 seconds
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <Toaster position="top-center" theme="system" closeButton />
    <ArkProvider>
      <App />
    </ArkProvider>
  </QueryClientProvider>
);
