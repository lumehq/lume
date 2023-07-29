import { nip19 } from 'nostr-tools';

import { useChannelProfile } from '@app/channel/hooks/useChannelProfile';

import { CopyIcon } from '@shared/icons';
import { Image } from '@shared/image';

import { DEFAULT_AVATAR } from '@stores/constants';

export function ChannelMetadata({ id }: { id: string }) {
  const metadata = useChannelProfile(id);
  const noteID = id ? nip19.noteEncode(id) : null;

  const copyNoteID = async () => {
    const { writeText } = await import('@tauri-apps/plugin-clipboard-manager');
    if (noteID) {
      await writeText(noteID);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-11 w-11 shrink-0 rounded-md">
        <Image
          src={metadata?.picture}
          fallback={DEFAULT_AVATAR}
          alt={id}
          className="h-11 w-11 rounded-md bg-zinc-900 object-contain"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1">
          <h5 className="text-lg font-semibold leading-none">{metadata?.name}</h5>
          <button type="button" onClick={() => copyNoteID()}>
            <CopyIcon width={14} height={14} className="text-zinc-400" />
          </button>
        </div>
        <p className="leading-tight text-zinc-400">
          {metadata?.about || (noteID && `${noteID.substring(0, 24)}...`)}
        </p>
      </div>
    </div>
  );
}
