import { DEFAULT_AVATAR } from '@lume/stores/constants';
import { useChannelProfile } from '@lume/utils/hooks/useChannelProfile';

import { Copy } from 'iconoir-react';
import { nip19 } from 'nostr-tools';

export const ChannelProfile = ({ id, pubkey }: { id: string; pubkey: string }) => {
  const metadata = useChannelProfile(id, pubkey);
  const noteID = id ? nip19.noteEncode(id) : null;

  const copyNoteID = async () => {
    const { writeText } = await import('@tauri-apps/api/clipboard');
    if (noteID) {
      await writeText(noteID);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative shrink-0 rounded-md">
        <img
          src={metadata?.picture || DEFAULT_AVATAR}
          alt={id}
          className="h-8 w-8 rounded bg-zinc-900 object-contain"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <h5 className="truncate text-sm font-medium leading-none text-zinc-100">{metadata?.name}</h5>
          <button onClick={() => copyNoteID()}>
            <Copy width={14} height={14} className="text-zinc-400" />
          </button>
        </div>
        <p className="text-xs leading-none text-zinc-400">
          {metadata?.about || (noteID && noteID.substring(0, 24) + '...')}
        </p>
      </div>
    </div>
  );
};
