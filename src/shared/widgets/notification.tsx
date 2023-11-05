import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { VList } from 'virtua';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';
import { NoteSkeleton } from '@shared/notes';
import { NotifyNote } from '@shared/notification/notifyNote';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { useNostr } from '@utils/hooks/useNostr';
import { sendNativeNotification } from '@utils/notification';

export function NotificationWidget() {
  const queryClient = useQueryClient();

  const { db } = useStorage();
  const { sub } = useNostr();
  const { ndk, relayUrls, fetcher } = useNDK();
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
        const events = await fetcher.fetchLatestEvents(
          relayUrls,
          {
            kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Reaction, NDKKind.Zap],
            '#p': [db.account.pubkey],
          },
          20,
          { asOf: pageParam === 0 ? undefined : pageParam, abortSignal: signal }
        );

        const ndkEvents = events.map((event) => {
          return new NDKEvent(ndk, event);
        });

        return ndkEvents.sort((a, b) => b.created_at - a.created_at);
      },
      getNextPageParam: (lastPage) => {
        const lastEvent = lastPage.at(-1);
        if (!lastEvent) return;
        return lastEvent.created_at - 1;
      },
      enabled: false,
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
    if (event.pubkey === db.account.pubkey) return null;
    return <NotifyNote key={event.id} event={event} />;
  }, []);

  useEffect(() => {
    if (status === 'success' && db.account) {
      const filter = {
        kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Reaction, NDKKind.Zap],
        '#p': [db.account.pubkey],
        since: Math.floor(Date.now() / 1000),
      };

      sub(
        filter,
        async (event) => {
          queryClient.setQueryData(
            ['notification'],
            (prev: { pageParams: number; pages: Array<NDKEvent[]> }) => ({
              ...prev,
              pages: [[event], ...prev.pages],
            })
          );

          const user = ndk.getUser({ pubkey: event.pubkey });
          await user.fetchProfile();

          switch (event.kind) {
            case NDKKind.Text:
              return await sendNativeNotification(
                `${
                  user.profile.displayName || user.profile.name
                } has replied to your note`
              );
            case NDKKind.EncryptedDirectMessage: {
              if (location.pathname !== '/chats') {
                return await sendNativeNotification(
                  `${
                    user.profile.displayName || user.profile.name
                  } has send you a encrypted message`
                );
              } else {
                break;
              }
            }
            case NDKKind.Repost:
              return await sendNativeNotification(
                `${
                  user.profile.displayName || user.profile.name
                } has reposted to your note`
              );
            case NDKKind.Reaction:
              return await sendNativeNotification(
                `${user.profile.displayName || user.profile.name} has reacted ${
                  event.content
                } to your note`
              );
            case NDKKind.Zap:
              return await sendNativeNotification(
                `${user.profile.displayName || user.profile.name} has zapped to your note`
              );
            default:
              break;
          }
        },
        false,
        'notification'
      );
    }
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
          <div className="flex h-full w-full flex-col items-center justify-center">
            <p className="mb-1 text-4xl">🎉</p>
            <p className="text-center font-medium text-neutral-600 dark:text-neutral-400">
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
