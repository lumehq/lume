import { UserDrawer } from '@app/browse/components/userDrawer';

import { useStorage } from '@libs/storage/provider';

import { User } from '@shared/user';

export function BrowseUsersScreen() {
  const { db } = useStorage();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div>
        <User pubkey={db.account.pubkey} variant="avatar" />
        <div className="mt-4 flex flex-col gap-2">
          {db.account.follows.map((user) => (
            <UserDrawer key={user} pubkey={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
