'use client';

import dynamic from 'next/dynamic';

const RelayProvider = dynamic(() => import('@components/relaysProvider'), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  return <RelayProvider>{children}</RelayProvider>;
}
