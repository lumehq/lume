/* eslint-disable @typescript-eslint/no-explicit-any */
import { relays } from '@stores/relays';

import { useStore } from '@nanostores/react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { NostrProvider } from 'nostr-react';
import type { ReactElement, ReactNode } from 'react';

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
  // Get relays
  const $relays = useStore(relays);

  return (
    <NostrProvider relayUrls={$relays} debug={false}>
      {getLayout(<Component {...pageProps} />)}
    </NostrProvider>
  );
}
