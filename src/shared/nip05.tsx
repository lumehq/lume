import { useQuery } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/api/http';
import { twMerge } from 'tailwind-merge';

import { UnverifiedIcon, VerifiedIcon } from '@shared/icons';

interface NIP05 {
  names: {
    [key: string]: string;
  };
}

export function NIP05({
  pubkey,
  nip05,
  className,
}: {
  pubkey: string;
  nip05: string;
  className?: string;
}) {
  const { status, data } = useQuery(
    ['nip05', nip05],
    async () => {
      try {
        const localPath = nip05.split('@')[0];
        const service = nip05.split('@')[1];
        // #TODO: use tauri native fetch to avoid CORS
        const verifyURL = `https://${service}/.well-known/nostr.json?name=${localPath}`;

        const res = await fetch(verifyURL, {
          method: 'GET',
          timeout: 10,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch NIP-05 service: ${nip05}`);

        const data = res.data as NIP05;
        if (data.names) {
          if (data.names[localPath] !== pubkey) return false;
          return true;
        }
        return false;
      } catch (e) {
        throw new Error(`Failed to verify NIP-05, error: ${e}`);
      }
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  if (status === 'loading') {
    <div className="h-3 w-20 animate-pulse rounded bg-white/10" />;
  }

  return (
    <div className={twMerge('leadning-none inline-flex items-center gap-1', className)}>
      <p>{nip05}</p>
      <div className="shrink-0">
        {data === true ? (
          <VerifiedIcon className="h-3 w-3 text-green-500" />
        ) : (
          <UnverifiedIcon className="h-3 w-3 text-red-500" />
        )}
      </div>
    </div>
  );
}
