import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import { NotiMention } from '@app/lodge/components/mention';
import { NotiReaction } from '@app/lodge/components/reaction';
import { NotiRepost } from '@app/lodge/components/repost';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';
import { TitleBar } from '@shared/titleBar';

import { useNostr } from '@utils/hooks/useNostr';

export function LodgeScreen() {
  const { db } = useStorage();
  const { sub, fetchActivities } = useNostr();
  const { status, data } = useQuery(
    ['lodge', db.account.pubkey],
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
    <div className="scrollbar-hide h-full w-full overflow-y-auto bg-white/10">
      <div className="grid grid-cols-3">
        <div className="col-span-2 h-full border-r border-white/5">
          <TitleBar title="Activities in the last 24 hours" />
          <div className="flex h-full flex-col gap-1.5">
            <div className="flex flex-col">
              {status === 'loading' ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <LoaderIcon className="h-5 w-5 animate-spin text-white" />
                    <p className="text-sm font-medium text-white/50">Loading</p>
                  </div>
                </div>
              ) : data?.length < 1 ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <p className="mb-1 text-4xl">🎉</p>
                  <p className="font-medium text-white/50">
                    Yo!, you&apos;ve no new activities
                  </p>
                </div>
              ) : (
                data.map((event) => renderItem(event))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
