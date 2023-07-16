import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { decode } from 'light-bolt11-decoder';

import { useNDK } from '@libs/ndk/provider';
import { createBlock, createReplyNote } from '@libs/storage';

import { LoaderIcon } from '@shared/icons';
import { MiniUser } from '@shared/notes/users/mini';

import { compactNumber } from '@utils/number';

export function NoteMetadata({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const { ndk } = useNDK();
  const { status, data } = useQuery(
    ['note-metadata', id],
    async () => {
      let replies = 0;
      let zap = 0;
      const users = [];

      const filter: NDKFilter = {
        '#e': [id],
        kinds: [1, 9735],
      };

      const events = await ndk.fetchEvents(filter);
      events.forEach((event: NDKEvent) => {
        switch (event.kind) {
          case 1:
            replies += 1;
            if (users.length < 3) users.push(event.pubkey);
            createReplyNote(
              id,
              event.id,
              event.pubkey,
              event.kind,
              event.tags,
              event.content,
              event.created_at
            );
            break;
          case 9735: {
            const bolt11 = event.tags.find((tag) => tag[0] === 'bolt11')[1];
            if (bolt11) {
              const decoded = decode(bolt11);
              const amount = decoded.sections.find((item) => item.name === 'amount');
              const sats = amount.value / 1000;
              zap += sats;
            }
            break;
          }
          default:
            break;
        }
      });

      return { replies, users, zap };
    },
    { refetchOnWindowFocus: false, refetchOnReconnect: false }
  );

  const block = useMutation({
    mutationFn: (data: { kind: number; title: string; content: string }) => {
      return createBlock(data.kind, data.title, data.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
    },
  });

  const openThread = (thread: string) => {
    block.mutate({ kind: 2, title: 'Thread', content: thread });
  };

  if (status === 'loading') {
    return (
      <div className="mb-3 flex items-center gap-3">
        <div className="mt-2h-6 w-11 shrink-0"></div>
        <div className="mt-2 inline-flex h-6 items-center">
          <LoaderIcon className="h-4 w-4 animate-spin text-zinc-100" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {data.replies > 0 ? (
        <>
          <div className="absolute bottom-0 left-[18px] h-[calc(100%-3.4rem)] w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600" />
          <div className="relative z-10 flex items-center gap-3 bg-zinc-900 pb-3">
            <div className="mt-2 inline-flex h-6 w-11 shrink-0 items-center justify-center">
              <div className="isolate flex -space-x-1 overflow-hidden">
                {data.users?.map((user, index) => (
                  <MiniUser key={user + index} pubkey={user} />
                ))}
              </div>
            </div>
            <div className="mt-2 inline-flex h-6 items-center gap-2">
              <button
                type="button"
                onClick={() => openThread(id)}
                className="text-zinc-500"
              >
                <span className="font-semibold text-zinc-300">{data.replies}</span>{' '}
                replies
              </button>
              <span className="text-zinc-500">·</span>
              <p className="text-zinc-500">
                <span className="font-semibold text-zinc-300">
                  {compactNumber.format(data.zap)}
                </span>{' '}
                zaps
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="pb-3" />
      )}
    </div>
  );
}
