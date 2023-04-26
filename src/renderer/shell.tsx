import AccountProvider from '@components/accountProvider';
import RelayProvider from '@components/relaysProvider';

import { PageContextProvider } from '@utils/hooks/usePageContext';

import { PageContext } from '@renderer/types';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';

const queryClient = new QueryClient();

export function Shell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  return (
    <StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <RelayProvider>
          <AccountProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </AccountProvider>
        </RelayProvider>
      </PageContextProvider>
    </StrictMode>
  );
}
