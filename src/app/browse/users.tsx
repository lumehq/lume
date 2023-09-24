import { useMemo } from 'react';

import { UserDrawer } from '@app/browse/components/userDrawer';

import { useStorage } from '@libs/storage/provider';

import { User } from '@shared/user';

import { getMultipleRandom } from '@utils/transform';

export function BrowseUsersScreen() {
  const { db } = useStorage();
  const data = useMemo(() => getMultipleRandom(db.account.follows, 10), []);

  return (
    <div>
      <User pubkey={db.account.pubkey} variant="avatar" />
      <div className="flex items-center gap-4">
        {data.map((user) => (
          <UserDrawer key={user} pubkey={user} />
        ))}
      </div>
    </div>
  );
}
