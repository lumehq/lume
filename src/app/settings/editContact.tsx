import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';
import { User } from '@shared/user';

export function EditContactScreen() {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, data } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const user = ndk.getUser({ pubkey: db.account.pubkey });

      const follows = await user.follows();
      return [...follows];
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
      {status === 'pending' ? (
        <div className="flex h-10 w-full items-center justify-center">
          <LoaderIcon className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        data.map((item) => (
          <div
            key={item.pubkey}
            className="flex h-16 w-full items-center justify-between rounded-xl bg-neutral-100 px-2.5 dark:bg-neutral-900"
          >
            <User pubkey={item.pubkey} variant="simple" />
          </div>
        ))
      )}
    </div>
  );
}
