import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useState } from 'react';
import { toast } from 'sonner';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { ReplyMediaUploader } from '@shared/notes';
import { User } from '@shared/user';

export function NoteReplyForm({ id }: { id: string }) {
  const { db } = useStorage();
  const { ndk, relayUrls } = useNDK();

  const [value, setValue] = useState('');

  const submit = async () => {
    const tags = [['e', id, relayUrls[0], 'root']];

    // publish event
    const event = new NDKEvent(ndk);
    event.content = value;
    event.kind = NDKKind.Text;
    event.tags = tags;

    const publishedRelays = await event.publish();
    if (publishedRelays) {
      toast.success(`Broadcasted to ${publishedRelays.size} relays successfully.`);
      setValue('');
    }
  };

  return (
    <div className="mt-3 flex gap-3">
      <User pubkey={db.account.pubkey} variant="miniavatar" />
      <div className="relative flex flex-1 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Reply to this thread..."
          className="relative h-36 w-full resize-none bg-transparent px-5 py-4 text-neutral-900 !outline-none placeholder:text-neutral-600 dark:text-neutral-100 dark:placeholder:text-neutral-400"
          spellCheck={false}
        />
        <div className="inline-flex items-center justify-end gap-2 rounded-b-xl border-t border-neutral-200 p-2 dark:border-neutral-800">
          <ReplyMediaUploader setValue={setValue} />
          <button
            onClick={() => submit()}
            disabled={value.length === 0 ? true : false}
            className="h-9 w-20 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}
