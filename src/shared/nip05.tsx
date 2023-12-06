import { useQuery } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';
import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

import { UnverifiedIcon, VerifiedIcon } from '@shared/icons';

interface NIP05 {
  names: {
    [key: string]: string;
  };
}

export const NIP05 = memo(function NIP05({
  pubkey,
  nip05,
  className,
}: {
  pubkey: string;
  nip05: string;
  className?: string;
}) {
  const { status, data } = useQuery({
    queryKey: ['nip05', nip05],
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      try {
        const localPath = nip05.split('@')[0];
        const service = nip05.split('@')[1];
        const verifyURL = `https://${service}/.well-known/nostr.json?name=${localPath}`;

        const res = await fetch(verifyURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          signal,
        });

        if (!res.ok) throw new Error(`Failed to fetch NIP-05 service: ${nip05}`);

        const data: NIP05 = await res.json();
        if (data.names) {
          if (data.names[localPath.toLowerCase()] !== pubkey) return false;
          return true;
        }
        return false;
      } catch (e) {
        throw new Error(`Failed to verify NIP-05, error: ${e}`);
      }
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (status === 'pending') {
    <div className="h-3 w-20 animate-pulse rounded bg-white/10" />;
  }

  return (
    <div className="inline-flex items-center gap-1">
      <p className={twMerge('text-sm font-medium', className)}>{nip05}</p>
      {data === true ? (
        <div className="inline-flex h-5 w-max shrink-0 items-center justify-center gap-1 rounded-full bg-teal-500 pl-0.5 pr-1.5 text-xs font-medium text-white">
          <VerifiedIcon className="h-4 w-4" />
          Verified
        </div>
      ) : (
        <div className="inline-flex h-5 w-max shrink-0 items-center justify-center gap-1.5 rounded-full bg-red-500 pl-0.5 pr-1.5 text-xs font-medium text-white">
          <UnverifiedIcon className="h-4 w-4" />
          Unverified
        </div>
      )}
    </div>
  );
});
