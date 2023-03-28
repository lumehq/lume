import RelayProvider from '@components/relaysProvider';

import { relaysAtom } from '@stores/relays';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, useAtomValue } from 'jotai';
import { queryClientAtom } from 'jotai-tanstack-query';
import { useHydrateAtoms } from 'jotai/react/utils';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';

import '../App.css';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

const HydrateAtoms = ({ children }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const relays = useAtomValue(relaysAtom);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <HydrateAtoms>
          <RelayProvider relays={relays}>{getLayout(<Component {...pageProps} />)}</RelayProvider>
        </HydrateAtoms>
      </Provider>
    </QueryClientProvider>
  );
}
