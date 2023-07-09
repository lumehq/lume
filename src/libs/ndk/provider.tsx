// source: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { PropsWithChildren, createContext, useContext } from 'react';

import { NDKInstance } from '@libs/ndk/instance';

interface NDKContext {
  ndk: NDK;
  relayUrls: string[];
  loadNdk: (_: string[]) => void;
}

const NDKContext = createContext<NDKContext>({
  ndk: new NDK({}),
  relayUrls: [],
  loadNdk: undefined,
});

const NDKProvider = ({ children }: PropsWithChildren<object>) => {
  const { ndk, relayUrls, loadNdk } = NDKInstance();

  if (ndk)
    return (
      <NDKContext.Provider
        value={{
          ndk,
          relayUrls,
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
