import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { decode } from 'light-bolt11-decoder';

import { useNDK } from '@libs/ndk/provider';

import { LoaderIcon } from '@shared/icons';

import { compactNumber } from '@utils/number';

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
        <LoaderIcon className="h-4 w-4 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="flex h-11 items-center gap-3">
      <p className="text-white/50">
        <span className="font-semibold text-white">
          {compactNumber.format(data.reactions)}
        </span>{' '}
        reactions
      </p>
      <span className="text-white/50">·</span>
      <p className="text-white/50">
        <span className="font-semibold text-white">
          {compactNumber.format(data.reposts)}
        </span>{' '}
        repostrs
      </p>
      <span className="text-white/50">·</span>
      <p className="text-white/50">
        <span className="font-semibold text-white">
          {compactNumber.format(data.zaps)}
        </span>{' '}
        zaps
      </p>
    </div>
  );
}
