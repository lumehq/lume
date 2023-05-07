import { PageContext } from '@lume/renderer/types';
import RelayProvider from '@lume/shared/relayProvider';
import { PageContextProvider } from '@lume/utils/hooks/usePageContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LayoutDefault } from './layoutDefault';

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
