import { useChannelMetadata } from '@utils/hooks/useChannelMetadata';

import { nip19 } from 'nostr-tools';
import Skeleton from 'react-loading-skeleton';

export const ChannelProfile = ({ id }: { id: string }) => {
  const metadata = useChannelMetadata(id);
  const noteID = nip19.noteEncode(id);

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative shrink-0 rounded-md">
        <img src={metadata?.picture || <Skeleton />} alt={id} className="h-8 w-8 rounded bg-zinc-900 object-cover" />
      </div>
      <div className="flex flex-col gap-1">
        <h5 className="truncate font-medium leading-none text-zinc-100">{metadata?.name || <Skeleton />}</h5>
        <p className="text-xs leading-none text-zinc-400">
          {metadata?.about || noteID.substring(0, 24) + '...' || <Skeleton />}
        </p>
      </div>
    </div>
  );
};
