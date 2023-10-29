import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useCallback, useEffect } from 'react';
import { VList } from 'virtua';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';
import { NotifyNote } from '@shared/notification/notifyNote';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { useActivities } from '@stores/activities';
import { useWidgets } from '@stores/widgets';

import { useNostr } from '@utils/hooks/useNostr';
import { Widget } from '@utils/types';

export function LocalNotificationWidget({ params }: { params: Widget }) {
  const { db } = useStorage();
  const { getAllActivities } = useNostr();

  const [activities, setActivities] = useActivities((state) => [
    state.activities,
    state.setActivities,
  ]);

  const isFetched = useWidgets((state) => state.isFetched);

  const renderEvent = useCallback(
    (event: NDKEvent) => {
      if (event.pubkey === db.account.pubkey) return null;
      return <NotifyNote key={event.id} event={event} />;
    },
    [activities]
  );

  useEffect(() => {
    async function getActivities() {
      const events = await getAllActivities(48);
      setActivities(events);
    }

    if (isFetched) getActivities();
  }, [isFetched]);

  return (
    <WidgetWrapper>
      <TitleBar id={params.id} title={params.title} />
      <div className="flex-1">
        {!activities ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-1.5">
              <LoaderIcon className="h-5 w-5 animate-spin text-neutral-900 dark:text-neutral-100" />
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Loading...
              </p>
            </div>
          </div>
        ) : activities.length < 1 ? (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <p className="mb-1 text-4xl">🎉</p>
            <p className="text-center font-medium text-neutral-600 dark:text-neutral-400">
              Hmm! Nothing new yet.
            </p>
          </div>
        ) : (
          <VList className="h-full" style={{ contentVisibility: 'auto' }}>
            {activities.map((event) => renderEvent(event))}
            <div className="h-14" />
          </VList>
        )}
      </div>
    </WidgetWrapper>
  );
}
