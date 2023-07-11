// source: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { NostrFetcher } from 'nostr-fetch';
import { PropsWithChildren, createContext, useContext } from 'react';

import { NDKInstance } from '@libs/ndk/instance';

interface NDKContext {
  ndk: NDK;
  relayUrls: string[];
  fetcher: NostrFetcher;
  loadNdk: (_: string[]) => void;
}

const NDKContext = createContext<NDKContext>({
  ndk: new NDK({}),
  relayUrls: [],
  fetcher: undefined,
  loadNdk: undefined,
});

const NDKProvider = ({ children }: PropsWithChildren<object>) => {
  const { ndk, relayUrls, fetcher, loadNdk } = NDKInstance();

  if (ndk)
    return (
      <NDKContext.Provider
        value={{
          ndk,
          relayUrls,
          fetcher,
          loadNdk,
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
