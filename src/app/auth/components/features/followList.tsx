import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';
import { User } from '@shared/user';

export function FollowList() {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, data } = useQuery({
    queryKey: ['follows'],
    queryFn: async () => {
      const user = ndk.getUser({ pubkey: db.account.pubkey });
      const follows = [...(await user.follows())].map((user) => user.pubkey);

      // update db
      await db.updateAccount('follows', JSON.stringify(follows));
      db.account.follows = follows;

      return follows;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="relative rounded-xl bg-neutral-100 p-3 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
      <h5 className="font-semibold">Your follows</h5>
      <div className="mt-2 flex w-full items-center justify-center">
        {status === 'pending' ? (
          <LoaderIcon className="h-4 w-4 animate-spin text-neutral-900 dark:text-neutral-100" />
        ) : (
          <div className="isolate flex -space-x-2">
            {data.slice(0, 16).map((item) => (
              <User key={item} pubkey={item} variant="stacked" />
            ))}
            {data.length > 16 ? (
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-900 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-800">
                <span className="text-xs font-medium">+{data.length}</span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
