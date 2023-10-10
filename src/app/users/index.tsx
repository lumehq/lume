import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { WVList } from 'virtua';

import { UserProfile } from '@app/users/components/profile';

import { useNDK } from '@libs/ndk/provider';

import {
  ArticleNote,
  FileNote,
  NoteSkeleton,
  NoteWrapper,
  Repost,
  TextNote,
  UnknownNote,
} from '@shared/notes';

import { nHoursAgo } from '@utils/date';

export function UserScreen() {
  const { pubkey } = useParams();
  const { ndk } = useNDK();
  const { status, data } = useQuery(['user-feed', pubkey], async () => {
    const events = await ndk.fetchEvents({
      kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Article],
      authors: [pubkey],
      since: nHoursAgo(48),
    });
    return [...events] as unknown as NDKEvent[];
  });

  // render event match event kind
  const renderItem = useCallback(
    (event: NDKEvent) => {
      switch (event.kind) {
        case NDKKind.Text:
          return (
            <NoteWrapper key={event.id} event={event}>
              <TextNote />
            </NoteWrapper>
          );
        case NDKKind.Repost:
          return <Repost key={event.id} event={event} />;
        case 1063:
          return (
            <NoteWrapper key={event.id} event={event}>
              <FileNote />
            </NoteWrapper>
          );
        case NDKKind.Article:
          return (
            <NoteWrapper key={event.id} event={event}>
              <ArticleNote />
            </NoteWrapper>
          );
        default:
          return (
            <NoteWrapper key={event.id} event={event}>
              <UnknownNote />
            </NoteWrapper>
          );
      }
    },
    [data]
  );

  return (
    <div className="relative h-full w-full overflow-y-auto scrollbar-none">
      <div data-tauri-drag-region className="absolute left-0 top-0 h-11 w-full" />
      <UserProfile pubkey={pubkey} />
      <div className="mt-6 h-full w-full border-t border-white/5 px-1.5">
        <h3 className="mb-2 pt-4 text-center text-lg font-semibold leading-none text-white">
          Latest posts
        </h3>
        <div className="mx-auto flex h-full max-w-[500px] flex-col justify-between gap-1.5 pb-4 pt-1.5">
          {status === 'loading' ? (
            <div className="px-3 py-1.5">
              <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-xl">
                <NoteSkeleton />
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="px-3 py-1.5">
              <div className="rounded-xl bg-neutral-100 px-3 py-6 dark:bg-neutral-900">
                <div className="flex flex-col items-center gap-4">
                  <p className="text-center text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    User doesn&apos;t have any posts in the last 48 hours.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <WVList>
              {data.map((item) => renderItem(item))}
              <div className="h-16" />
            </WVList>
          )}
        </div>
      </div>
    </div>
  );
}
