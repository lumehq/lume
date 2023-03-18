import { DatabaseContext } from '@components/contexts/database';
import { RelayContext } from '@components/contexts/relay';

import useLocalStorage from '@rehooks/local-storage';
import Image from 'next/image';
import { memo, useCallback, useContext, useMemo } from 'react';

export const ActiveAccount = memo(function ActiveAccount({ user }: { user: any }) {
  const userData = JSON.parse(user.metadata);

  const { db }: any = useContext(DatabaseContext);
  const relayPool: any = useContext(RelayContext);

  const [relays]: any = useLocalStorage('relays');
  const [currentUser]: any = useLocalStorage('current-user');

  // save follows to database
  const insertFollows = useCallback(
    async (follows) => {
      follows.forEach(async (item) => {
        if (item) {
          // insert to database
          await db.execute(
            `INSERT OR IGNORE INTO follows (pubkey, account, kind) VALUES ("${item[1]}", "${currentUser.id}", "0")`
          );
        }
      });
    },
    [db, currentUser.id]
  );

  useMemo(() => {
    relayPool.subscribe(
      [
        {
          kinds: [3],
          authors: [currentUser.id],
        },
      ],
      relays,
      (event: any) => {
        insertFollows(event.tags);
      },
      undefined,
      (events, relayURL) => {
        console.log(events, relayURL);
      },
      {
        unsubscribeOnEose: true,
      }
    );
  }, [currentUser.id, insertFollows, relayPool, relays]);

  return (
    <div className="relative h-11 w-11 shrink rounded-lg ring-1 ring-fuchsia-500 ring-offset-2 ring-offset-black">
      <Image src={userData.picture} alt="user's avatar" fill={true} className="rounded-lg object-cover" />
    </div>
  );
});
