import { RelayProvider } from '@shared/relayProvider';

import { PageContextProvider } from '@utils/hooks/usePageContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LayoutDefault } from './layoutDefault';
import { PageContext } from './types';

const queryClient = new QueryClient();

export function Shell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  const Layout = (pageContext.exports.Layout as React.ElementType) || (LayoutDefault as React.ElementType);

  return (
    <PageContextProvider pageContext={pageContext}>
      <RelayProvider>
        <Layout>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Layout>
      </RelayProvider>
    </PageContextProvider>
  );
}
