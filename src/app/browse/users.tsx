import { DndContext } from '@dnd-kit/core';
import { useMemo } from 'react';

import { UserDrawer } from '@app/browse/components/userDrawer';
import { UserDropable } from '@app/browse/components/userDropable';

import { useStorage } from '@libs/storage/provider';

import { User } from '@shared/user';

import { getMultipleRandom } from '@utils/transform';

export function BrowseUsersScreen() {
  const { db } = useStorage();

  const data = useMemo(() => getMultipleRandom(db.account.follows, 10), []);

  const handleDragEnd = (event) => {
    console.log(event.id);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="scrollbar-hide flex h-full w-full flex-col items-center justify-center overflow-x-auto overflow-y-auto">
        <div className="flex items-center gap-16">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-fuchsia-500">Follows</h3>
            <div className="grid grid-cols-5 gap-6 rounded-lg border border-fuchsia-500/50 bg-fuchsia-500/10 p-4">
              {data.map((user) => (
                <UserDrawer key={user} pubkey={user} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-16">
            <User pubkey={db.account.pubkey} variant="avatar" />
            <UserDropable />
          </div>
        </div>
      </div>
    </DndContext>
  );
}
