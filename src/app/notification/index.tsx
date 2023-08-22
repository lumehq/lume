import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import { NotiMention } from '@app/notification/components/mention';
import { NotiReaction } from '@app/notification/components/reaction';
import { NotiRepost } from '@app/notification/components/repost';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function NotificationScreen() {
  const { db } = useStorage();
  const { sub, fetchActivities } = useNostr();
  const { status, data } = useQuery(
    ['notification', db.account.pubkey],
    async () => {
      return await fetchActivities();
    },
    { refetchOnWindowFocus: false }
  );

  const renderItem = useCallback(
    (event: NDKEvent) => {
      switch (event.kind) {
        case 1:
          return <NotiMention key={event.id} event={event} />;
        case 6:
          return <NotiRepost key={event.id} event={event} />;
        case 7:
          return <NotiReaction key={event.id} event={event} />;
        default:
          return null;
      }
    },
    [data]
  );

  useEffect(() => {
    const filter: NDKFilter = {
      '#p': [db.account.pubkey],
      kinds: [1, 3, 6, 7, 9735],
      since: db.account.last_login_at ?? Math.floor(Date.now() / 1000),
    };

    sub(filter, async (event) => {
      console.log('[notify] new noti', event.id);
    });
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto bg-white/10 px-3">
      <div className="mb-3 px-3 pt-11">
        <h3 className="text-xl font-bold">Notifications</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 flex flex-col">
          {status === 'loading' ? (
            <div className="inline-flex items-center justify-center px-4 py-3">
              <LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-white" />
            </div>
          ) : data?.length < 1 ? (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="mb-1 text-4xl">🎉</p>
              <p className="font-medium text-white/50">
                Yo!, you&apos;ve no new notifications
              </p>
            </div>
          ) : (
            data.map((event) => renderItem(event))
          )}
        </div>
      </div>
    </div>
  );
}
