import { NDKEvent, NDKKind, NDKSubscription } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { VList } from 'virtua';

import { useArk } from '@libs/ark';

import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';
import { MemoizedNotifyNote, NoteSkeleton } from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { FETCH_LIMIT } from '@utils/constants';
import { sendNativeNotification } from '@utils/notification';

export function NotificationWidget() {
  const queryClient = useQueryClient();

  const { ark } = useArk();
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
            '#p': [ark.account.pubkey],
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

  const renderEvent = useCallback((event: NDKEvent) => {
    if (event.pubkey === ark.account.pubkey) return null;
    return <MemoizedNotifyNote key={event.id} event={event} />;
  }, []);

  useEffect(() => {
    let sub: NDKSubscription = undefined;

    if (status === 'success' && ark.account) {
      const filter = {
        kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Reaction, NDKKind.Zap],
        '#p': [ark.account.pubkey],
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
            case NDKKind.EncryptedDirectMessage: {
              if (location.pathname !== '/chats') {
                return await sendNativeNotification(
                  `${
                    profile.displayName || profile.name
                  } has send you a encrypted message`
                );
              } else {
                break;
              }
            }
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
    <WidgetWrapper>
      <TitleBar id="9998" title="Notification" isLive />
      <VList className="flex-1" overscan={2}>
        {status === 'pending' ? (
          <div className="px-3 py-1.5">
            <div className="rounded-xl bg-neutral-100 px-3 py-3 dark:bg-neutral-900">
              <NoteSkeleton />
            </div>
          </div>
        ) : allEvents.length < 1 ? (
          <div className="flex h-[400px] w-full flex-col items-center justify-center">
            <p className="mb-2 text-4xl">🎉</p>
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
    </WidgetWrapper>
  );
}
