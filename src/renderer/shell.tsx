import RelayProvider from '@components/relaysProvider';

import { PageContextProvider } from '@utils/hooks/usePageContext';

import { PageContext } from '@renderer/types';

import { StrictMode } from 'react';

export function Shell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  return (
    <StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <RelayProvider>{children}</RelayProvider>
      </PageContextProvider>
    </StrictMode>
  );
}
