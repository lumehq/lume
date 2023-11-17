import { NDKEvent, NDKKind, NostrEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { memo } from 'react';

import { useNDK } from '@libs/ndk/provider';

import {
  MemoizedArticleKind,
  MemoizedFileKind,
  MemoizedTextKind,
  NoteActions,
  NoteSkeleton,
} from '@shared/notes';
import { User } from '@shared/user';

export function Repost({ event }: { event: NDKEvent }) {
  const { ndk } = useNDK();
  const { status, data: repostEvent } = useQuery({
    queryKey: ['repost', event.id],
    queryFn: async () => {
      try {
        if (event.content.length > 50) {
          const embed = JSON.parse(event.content) as NostrEvent;
          const embedEvent = new NDKEvent(ndk, embed);
          return embedEvent;
        }

        const id = event.tags.find((el) => el[0] === 'e')[1];
        if (!id) throw new Error('Failed to get repost event id');

        const ndkEvent = await ndk.fetchEvent(id);
        if (!ndkEvent) return Promise.reject(new Error('Failed to get repost event'));

        return ndkEvent;
      } catch {
        throw new Error('Failed to get repost event');
      }
    },
    refetchOnWindowFocus: false,
  });

  const renderContentByKind = () => {
    if (!repostEvent) return null;
    switch (repostEvent.kind) {
      case NDKKind.Text:
        return <MemoizedTextKind content={repostEvent.content} />;
      case 1063:
        return <MemoizedFileKind tags={repostEvent.tags} />;
      case NDKKind.Article:
        return <MemoizedArticleKind id={repostEvent.id} tags={repostEvent.tags} />;
      default:
        return null;
    }
  };

  if (status === 'pending') {
    return (
      <div className="w-full px-3 pb-3">
        <NoteSkeleton />
      </div>
    );
  }

  return (
    <div className="mb-3 h-min w-full px-3">
      <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl bg-neutral-50 pt-3 dark:bg-neutral-950">
        <User pubkey={event.pubkey} time={event.created_at} variant="repost" />
        <div className="relative flex flex-col gap-2">
          <User
            pubkey={repostEvent.pubkey}
            time={repostEvent.created_at}
            eventId={repostEvent.id}
          />
          {renderContentByKind()}
          <NoteActions event={repostEvent} />
        </div>
      </div>
    </div>
  );
}

export const MemoizedRepost = memo(Repost);
