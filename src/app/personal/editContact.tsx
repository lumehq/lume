import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { ArrowLeftIcon, LoaderIcon } from '@shared/icons';
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
    <div className="flex h-full w-full flex-col overflow-y-auto pb-10">
      <div className="flex h-14 shrink-0 items-center justify-between px-3">
        <Link
          to="/personal"
          className="inline-flex h-10 w-20 items-center justify-center gap-2 font-medium text-neutral-700 dark:text-neutral-300"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Link>
        <h1 className="font-semibold">Contact Manager</h1>
        <div className="w-20" />
      </div>
      <div className="mx-auto flex  w-full max-w-xl flex-col gap-3">
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
    </div>
  );
}
