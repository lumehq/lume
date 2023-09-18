// source: https://github.com/nostr-dev-kit/ndk-react/
import NDK from '@nostr-dev-kit/ndk';
import { PropsWithChildren, createContext, useContext } from 'react';

import { NDKInstance } from '@libs/ndk/instance';

interface NDKContext {
  ndk: undefined | NDK;
  relayUrls: string[];
}

const NDKContext = createContext<NDKContext>({
  ndk: undefined,
  relayUrls: [],
});

const NDKProvider = ({ children }: PropsWithChildren<object>) => {
  const { ndk, relayUrls } = NDKInstance();

  return (
    <NDKContext.Provider
      value={{
        ndk,
        relayUrls,
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
