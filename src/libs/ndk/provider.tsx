// source: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import Markdown from 'markdown-to-jsx';
import { NostrFetcher } from 'nostr-fetch';
import { PropsWithChildren, createContext, useContext } from 'react';

import { NDKInstance } from '@libs/ndk/instance';

import { LoaderIcon } from '@shared/icons';

import { QUOTES } from '@utils/constants';

interface NDKContext {
  ndk: undefined | NDK;
  fetcher: undefined | NostrFetcher;
  relayUrls: string[];
}

const NDKContext = createContext<NDKContext>({
  ndk: undefined,
  fetcher: undefined,
  relayUrls: [],
});

const NDKProvider = ({ children }: PropsWithChildren<object>) => {
  const { ndk, relayUrls, fetcher } = NDKInstance();

  if (!ndk)
    return (
      <div
        data-tauri-drag-region
        className="relative flex h-screen w-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950"
      >
        <div className="flex max-w-2xl flex-col items-start gap-1">
          <h5 className="font-semibold uppercase">TIP:</h5>
          <Markdown
            options={{
              overrides: {
                a: {
                  props: {
                    className: 'text-blue-500 hover:text-blue-600',
                    target: '_blank',
                  },
                },
              },
            }}
            className="text-4xl font-semibold leading-snug text-neutral-300 dark:text-neutral-700"
          >
            {QUOTES[Math.floor(Math.random() * QUOTES.length)]}
          </Markdown>
        </div>
        <div className="absolute bottom-5 right-5 inline-flex items-center gap-2.5">
          <LoaderIcon className="h-6 w-6 animate-spin text-blue-500" />
          <p className="font-semibold">Connecting to relays...</p>
        </div>
      </div>
    );

  return (
    <NDKContext.Provider
      value={{
        ndk,
        relayUrls,
        fetcher,
      }}
    >
      {children}
    </NDKContext.Provider>
  );
};

const useNDK = () => {
  const context = useContext(NDKContext);
  if (context === undefined) {
    throw new Error('import NDKProvider to use useNDK');
  }
  return context;
};

export { NDKProvider, useNDK };
