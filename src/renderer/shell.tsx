import AccountProvider from '@lume/shared/accountProvider';
import { PageContextProvider } from '@lume/utils/hooks/usePageContext';

import { PageContext } from '@renderer/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LayoutDefault } from './layoutDefault';

const queryClient = new QueryClient();

export function Shell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  const Layout = (pageContext.exports.Layout as React.ElementType) || (LayoutDefault as React.ElementType);

  return (
    <PageContextProvider pageContext={pageContext}>
      <Layout>
        <AccountProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </AccountProvider>
      </Layout>
    </PageContextProvider>
  );
}
