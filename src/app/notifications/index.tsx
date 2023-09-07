import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useCallback } from 'react';

import { NotiMention } from '@app/notifications/components/mention';
import { NotiReaction } from '@app/notifications/components/reaction';
import { NotiRepost } from '@app/notifications/components/repost';

import { TitleBar } from '@shared/titleBar';

import { useActivities } from '@stores/activities';

export function NotificationScreen() {
  const activities = useActivities((state) => state.activities);

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
    [activities]
  );

  return (
    <div className="scrollbar-hide h-full w-full overflow-y-auto bg-white/10 backdrop-blur-xl">
      <div className="grid h-full grid-cols-3">
        <div className="col-span-2 flex flex-col border-r border-white/5">
          <TitleBar title="Activities in the last 24 hours" />
          <div className="flex h-full flex-col gap-1.5">
            <div className="flex h-full flex-col">
              {activities?.length < 1 ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <p className="mb-1 text-4xl">🎉</p>
                  <p className="font-medium text-white/50">
                    Yo!, no new activities around you in the last 24 hours
                  </p>
                </div>
              ) : (
                activities.map((event) => renderItem(event))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
