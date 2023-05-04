import CopyIcon from '@lume/shared/icons/copy';
import { Image } from '@lume/shared/image';
import { DEFAULT_AVATAR } from '@lume/stores/constants';
import { useChannelProfile } from '@lume/utils/hooks/useChannelProfile';

import { nip19 } from 'nostr-tools';

export default function ChannelMetadata({ id, pubkey }: { id: string; pubkey: string }) {
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
        <Image
          src={metadata?.picture || DEFAULT_AVATAR}
          alt={id}
          className="h-8 w-8 rounded bg-zinc-900 object-contain ring-2 ring-zinc-950"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <h5 className="truncate text-sm font-medium leading-none text-zinc-100">{metadata?.name}</h5>
          <button onClick={() => copyNoteID()}>
            <CopyIcon width={14} height={14} className="text-zinc-400" />
          </button>
        </div>
        <p className="text-xs leading-none text-zinc-400">
          {metadata?.about || (noteID && noteID.substring(0, 24) + '...')}
        </p>
      </div>
    </div>
  );
}
