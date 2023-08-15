import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { decode } from 'light-bolt11-decoder';

import { useNDK } from '@libs/ndk/provider';
import { createReplyNote } from '@libs/storage';

import { LoaderIcon } from '@shared/icons';
import { MiniUser } from '@shared/notes/users/mini';

import { BLOCK_KINDS } from '@stores/constants';
import { useWidgets } from '@stores/widgets';

import { compactNumber } from '@utils/number';

export function NoteMetadata({ id }: { id: string }) {
  const setWidget = useWidgets((state) => state.setWidget);

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
    { refetchOnWindowFocus: false, refetchOnReconnect: false, refetchOnMount: false }
  );

  if (status === 'loading') {
    return (
      <div className="relative z-10 flex items-center gap-3 pb-3">
        <div className="mt-2 h-6 w-11 shrink-0"></div>
        <div className="mt-2 inline-flex h-6">
          <LoaderIcon className="h-4 w-4 animate-spin text-white" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {data.replies > 0 ? (
        <>
          <div className="absolute left-[18px] top-14 h-[calc(100%-6.4rem)] w-0.5 bg-gradient-to-t from-white/20 to-white/10" />
          <div className="relative z-10 flex items-center gap-3 pb-3">
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
                onClick={() =>
                  setWidget({ kind: BLOCK_KINDS.thread, title: 'Thread', content: id })
                }
                className="text-white/50"
              >
                <span className="font-semibold text-white">{data.replies}</span> replies
              </button>
              <span className="text-white/50">·</span>
              <p className="text-white/50">
                <span className="font-semibold text-white">
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
