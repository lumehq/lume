'use client';

import RelayProvider from '@components/relaysProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <RelayProvider>{children}</RelayProvider>;
}
