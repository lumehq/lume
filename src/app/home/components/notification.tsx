import { NDKEvent, NDKKind, NDKSubscription } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { VList } from 'virtua';
import { NoteSkeleton, TextNote, Widget, useArk, useStorage } from '@libs/ark';
import { AnnouncementIcon, ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';
import { FETCH_LIMIT } from '@utils/constants';
import { sendNativeNotification } from '@utils/notification';

export function NotificationWidget() {
  const ark = useArk();
  const storage = useStorage();
  const queryClient = useQueryClient();

  const { status, data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['notification'],
      initialPageParam: 0,
      queryFn: async ({
        signal,
        pageParam,
      }: {
        signal: AbortSignal;
        pageParam: number;
      }) => {
        const events = await ark.getInfiniteEvents({
          filter: {
            kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Reaction, NDKKind.Zap],
            '#p': [storage.account.pubkey],
          },
          limit: FETCH_LIMIT,
          pageParam,
          signal,
        });

        return events;
      },
      getNextPageParam: (lastPage) => {
        const lastEvent = lastPage.at(-1);
        if (!lastEvent) return;
        return lastEvent.created_at - 1;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    });

  const allEvents = useMemo(
    () => (data ? data.pages.flatMap((page) => page) : []),
    [data]
  );

  const renderEvent = (event: NDKEvent) => {
    if (event.pubkey === storage.account.pubkey) return null;
    return <TextNote key={event.id} event={event} />;
  };

  useEffect(() => {
    let sub: NDKSubscription = undefined;

    if (status === 'success' && storage.account) {
      const filter = {
        kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Reaction, NDKKind.Zap],
        '#p': [storage.account.pubkey],
        since: Math.floor(Date.now() / 1000),
      };

      sub = ark.subscribe({
        filter,
        closeOnEose: false,
        cb: async (event) => {
          queryClient.setQueryData(
            ['notification'],
            (prev: { pageParams: number; pages: Array<NDKEvent[]> }) => ({
              ...prev,
              pages: [[event], ...prev.pages],
            })
          );

          const profile = await ark.getUserProfile({ pubkey: event.pubkey });

          switch (event.kind) {
            case NDKKind.Text:
              return await sendNativeNotification(
                `${profile.displayName || profile.name} has replied to your note`
              );
            case NDKKind.Repost:
              return await sendNativeNotification(
                `${profile.displayName || profile.name} has reposted to your note`
              );
            case NDKKind.Reaction:
              return await sendNativeNotification(
                `${profile.displayName || profile.name} has reacted ${
                  event.content
                } to your note`
              );
            case NDKKind.Zap:
              return await sendNativeNotification(
                `${profile.displayName || profile.name} has zapped to your note`
              );
            default:
              break;
          }
        },
      });
    }

    return () => {
      if (sub) sub.stop();
    };
  }, [status]);

  return (
    <Widget.Root>
      <Widget.Header
        id="9998"
        queryKey={['notification']}
        title="Notification"
        icon={<AnnouncementIcon className="h-5 w-5" />}
      />
      <Widget.Content>
        <VList className="flex-1" overscan={2}>
          {status === 'pending' ? (
            <NoteSkeleton />
          ) : allEvents.length < 1 ? (
            <div className="my-3 flex w-full items-center justify-center gap-2">
              <div>🎉</div>
              <p className="text-center font-medium text-neutral-900 dark:text-neutral-100">
                Hmm! Nothing new yet.
              </p>
            </div>
          ) : (
            allEvents.map((event) => renderEvent(event))
          )}
          <div className="flex h-16 items-center justify-center px-3 pb-3">
            {hasNextPage ? (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                className="inline-flex h-10 w-max items-center justify-center gap-2 rounded-full bg-blue-500 px-6 font-medium text-white hover:bg-blue-600 focus:outline-none"
              >
                {isFetchingNextPage ? (
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ArrowRightCircleIcon className="h-5 w-5" />
                    Load more
                  </>
                )}
              </button>
            ) : null}
          </div>
        </VList>
      </Widget.Content>
    </Widget.Root>
  );
}
