import DatabaseProvider from '@components/contexts/database';
import RelayProvider from '@components/contexts/relay';

import { useLocalStorage } from '@rehooks/local-storage';
import { Provider } from 'jotai';
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

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  // Get relays from localstorage
  const [relays] = useLocalStorage('relays');

  return (
    <Provider>
      <DatabaseProvider>
        <RelayProvider relays={relays}>{getLayout(<Component {...pageProps} />)}</RelayProvider>
      </DatabaseProvider>
    </Provider>
  );
}
