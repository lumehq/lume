import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';

import { compactNumber } from '@utils/number';

export function ContactCard() {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, data } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const user = ndk.getUser({ hexpubkey: db.account.pubkey });
      return await user.follows();
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="col-span-1 h-44 rounded-2xl bg-neutral-100 transition-all duration-150 ease-smooth hover:scale-105 dark:bg-neutral-900">
      {status === 'pending' ? (
        <div className="flex h-full w-full items-center justify-center">
          <LoaderIcon className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div className="flex h-full w-full flex-col justify-between p-4">
          <h3 className="pt-1 text-5xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
            {compactNumber.format(data.size)}
          </h3>
          <div className="mt-auto text-xl font-medium leading-none text-neutral-600 dark:text-neutral-400">
            Contacts
          </div>
        </div>
      )}
    </div>
  );
}
