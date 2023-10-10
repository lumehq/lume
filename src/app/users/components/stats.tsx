import { useQuery } from '@tanstack/react-query';

import { LoaderIcon } from '@shared/icons';

import { compactNumber } from '@utils/number';

export function UserStats({ pubkey }: { pubkey: string }) {
  const { status, data } = useQuery(['user-metadata', pubkey], async () => {
    const res = await fetch(`https://api.nostr.band/v0/stats/profile/${pubkey}`);
    if (!res.ok) {
      throw new Error('Error');
    }
    return await res.json();
  });

  if (status === 'loading') {
    return (
      <div className="flex w-full items-center justify-center">
        <LoaderIcon className="h-5 w-5 animate-spin text-neutral-900 dark:text-neutral-100" />
      </div>
    );
  }

  if (status === 'error') {
    return <div className="flex w-full items-center justify-center" />;
  }

  return (
    <div className="flex w-full items-center justify-center gap-10">
      <div className="inline-flex flex-col items-center gap-1">
        <span className="font-semibold leading-none text-neutral-900 dark:text-neutral-100">
          {compactNumber.format(data.stats[pubkey].followers_pubkey_count) ?? 0}
        </span>
        <span className="text-sm leading-none text-neutral-500 dark:text-neutral-400">
          Followers
        </span>
      </div>
      <div className="inline-flex flex-col items-center gap-1">
        <span className="font-semibold leading-none text-neutral-900 dark:text-neutral-100">
          {compactNumber.format(data.stats[pubkey].pub_following_pubkey_count) ?? 0}
        </span>
        <span className="text-sm leading-none text-neutral-500 dark:text-neutral-400">
          Following
        </span>
      </div>
      <div className="inline-flex flex-col items-center gap-1">
        <span className="font-semibold leading-none text-neutral-900 dark:text-neutral-100">
          {data.stats[pubkey].zaps_received
            ? compactNumber.format(data.stats[pubkey].zaps_received.msats / 1000)
            : 0}
        </span>
        <span className="text-sm leading-none text-neutral-500 dark:text-neutral-400">
          Zaps received
        </span>
      </div>
      <div className="inline-flex flex-col items-center gap-1">
        <span className="font-semibold leading-none text-neutral-900 dark:text-neutral-100">
          {data.stats[pubkey].zaps_sent
            ? compactNumber.format(data.stats[pubkey].zaps_sent.msats / 1000)
            : 0}
        </span>
        <span className="text-sm leading-none text-neutral-500 dark:text-neutral-400">
          Zaps sent
        </span>
      </div>
    </div>
  );
}
