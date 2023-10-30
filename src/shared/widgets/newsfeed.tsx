import { NDKEvent, NDKFilter, NDKKind } from '@nostr-dev-kit/ndk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { VList } from 'virtua';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';
import {
  MemoizedArticleNote,
  MemoizedFileNote,
  MemoizedRepost,
  MemoizedTextNote,
  NoteSkeleton,
  NoteWrapper,
  UnknownNote,
} from '@shared/notes';
import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { nHoursAgo } from '@utils/date';
import { useNostr } from '@utils/hooks/useNostr';

export function NewsfeedWidget() {
  const { db } = useStorage();
  const { sub } = useNostr();
  const { relayUrls, ndk, fetcher } = useNDK();
  const { status, data } = useQuery({
    queryKey: ['newsfeed'],
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const rootIds = new Set();
      const dedupQueue = new Set();

      const events = await fetcher.fetchAllEvents(
        relayUrls,
        {
          kinds: [NDKKind.Text, NDKKind.Repost, 1063, NDKKind.Article],
          authors: db.account.circles,
        },
        {
          since: db.account.last_login_at === 0 ? nHoursAgo(4) : db.account.last_login_at,
        },
        { abortSignal: signal }
      );

      const ndkEvents = events.map((event) => {
        return new NDKEvent(ndk, event);
      });

      ndkEvents.forEach((event) => {
        const tags = event.tags.filter((el) => el[0] === 'e');
        if (tags && tags.length > 0) {
          const rootId = tags.filter((el) => el[3] === 'root')[1] ?? tags[0][1];
          if (rootIds.has(rootId)) return dedupQueue.add(event.id);
          rootIds.add(rootId);
        }
      });

      return ndkEvents
        .filter((event) => !dedupQueue.has(event.id))
        .sort((a, b) => b.created_at - a.created_at);
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const currentLastEvent = data.at(-1);
      const lastCreatedAt = currentLastEvent.created_at - 1;

      const rootIds = new Set();
      const dedupQueue = new Set();

      const events = await fetcher.fetchLatestEvents(
        relayUrls,
        {
          kinds: [NDKKind.Text, NDKKind.Repost, 1063, NDKKind.Article],
          authors: db.account.circles,
        },
        100,
        {
          asOf: lastCreatedAt,
        }
      );

      const ndkEvents = events.map((event) => {
        return new NDKEvent(ndk, event);
      });

      ndkEvents.forEach((event) => {
        const tags = event.tags.filter((el) => el[0] === 'e');
        if (tags && tags.length > 0) {
          const rootId = tags.filter((el) => el[3] === 'root')[1] ?? tags[0][1];
          if (rootIds.has(rootId)) return dedupQueue.add(event.id);
          rootIds.add(rootId);
        }
      });

      return ndkEvents
        .filter((event) => !dedupQueue.has(event.id))
        .sort((a, b) => b.created_at - a.created_at);
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(['newsfeed'], (old: NDKEvent[]) => [...old, ...data]);
    },
  });

  const renderItem = useCallback((event: NDKEvent) => {
    switch (event.kind) {
      case NDKKind.Text:
        return (
          <NoteWrapper key={event.id} event={event}>
            <MemoizedTextNote />
          </NoteWrapper>
        );
      case NDKKind.Repost:
        return <MemoizedRepost key={event.id} event={event} />;
      case 1063:
        return (
          <NoteWrapper key={event.id} event={event}>
            <MemoizedFileNote />
          </NoteWrapper>
        );
      case NDKKind.Article:
        return (
          <NoteWrapper key={event.id} event={event}>
            <MemoizedArticleNote />
          </NoteWrapper>
        );
      default:
        return (
          <NoteWrapper key={event.id} event={event}>
            <UnknownNote />
          </NoteWrapper>
        );
    }
  }, []);

  useEffect(() => {
    if (db.account && db.account.circles.length > 0) {
      const filter: NDKFilter = {
        kinds: [NDKKind.Text, NDKKind.Repost],
        authors: db.account.circles,
        since: Math.floor(Date.now() / 1000),
      };

      sub(filter, async (event) => {
        queryClient.setQueryData(['newsfeed'], (old: NDKEvent[]) => [event, ...old]);
      });
    }
  }, []);

  return (
    <WidgetWrapper>
      <TitleBar id="9999" />
      <VList className="flex-1">
        {status === 'pending' ? (
          <div>
            <div className="px-3 py-1.5">
              <div className="rounded-xl bg-neutral-100 px-3 py-3 dark:bg-neutral-900">
                <NoteSkeleton />
              </div>
            </div>
            <div className="flex h-11 items-center justify-center">
              <LoaderIcon className="h-4 w-4 animate-spin" />
            </div>
          </div>
        ) : (
          data.map((item) => renderItem(item))
        )}
        <div className="flex h-16 items-center justify-center px-3 pb-3">
          {data ? (
            <button
              type="button"
              onClick={() => mutation.mutate()}
              className="inline-flex h-10 w-max items-center justify-center gap-2 rounded-full bg-blue-500 px-6 font-medium text-white hover:bg-blue-600 focus:outline-none"
            >
              <ArrowRightCircleIcon className="h-5 w-5" />
              Load more
            </button>
          ) : null}
        </div>
      </VList>
    </WidgetWrapper>
  );
}
