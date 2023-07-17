import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { decode } from 'light-bolt11-decoder';

import { useNDK } from '@libs/ndk/provider';

import { LoaderIcon } from '@shared/icons';

export function NoteStats({ id }: { id: string }) {
  const { ndk } = useNDK();
  const { status, data } = useQuery(
    ['note-stats', id],
    async () => {
      let reactions = 0;
      let reposts = 0;
      let zaps = 0;

      const filter: NDKFilter = {
        '#e': [id],
        kinds: [6, 7, 9735],
      };

      const events = await ndk.fetchEvents(filter);
      events.forEach((event: NDKEvent) => {
        switch (event.kind) {
          case 6:
            reposts += 1;
            break;
          case 7:
            reactions += 1;
            break;
          case 9735: {
            const bolt11 = event.tags.find((tag) => tag[0] === 'bolt11')[1];
            if (bolt11) {
              const decoded = decode(bolt11);
              const amount = decoded.sections.find((item) => item.name === 'amount');
              const sats = amount.value / 1000;
              zaps += sats;
            }
            break;
          }
          default:
            break;
        }
      });

      return { reposts, reactions, zaps };
    },
    { refetchOnWindowFocus: false, refetchOnReconnect: false }
  );

  if (status === 'loading') {
    return (
      <div className="flex h-11 items-center">
        <LoaderIcon className="h-4 w-4 animate-spin text-zinc-100" />
      </div>
    );
  }

  return (
    <div className="flex h-11 items-center gap-3">
      <p className="inline-flex h-6 items-center justify-center gap-1 rounded bg-zinc-800 px-2 text-sm">
        {data.reactions}
        <span className="text-zinc-400">reactions</span>
      </p>
      <p className="inline-flex h-6 items-center justify-center gap-1 rounded bg-zinc-800 px-2 text-sm">
        {data.reposts}
        <span className="text-zinc-400">reposts</span>
      </p>
      <p className="inline-flex h-6 items-center justify-center gap-1 rounded bg-zinc-800 px-2 text-sm">
        {data.zaps}
        <span className="text-zinc-400">zaps</span>
      </p>
    </div>
  );
}
