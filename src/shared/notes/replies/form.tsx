import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useState } from 'react';
import { toast } from 'sonner';

import { useNDK } from '@libs/ndk/provider';

import { ReplyMediaUploader } from '@shared/notes';

export function NoteReplyForm({ eventId }: { eventId: string }) {
  const { ndk, relayUrls } = useNDK();
  const [value, setValue] = useState('');

  const submit = async () => {
    const tags = [['e', eventId, relayUrls[0], 'root']];

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
    <div className="mt-3 flex flex-col rounded-xl bg-neutral-50 dark:bg-neutral-950">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Reply to this post..."
        className="h-28 w-full resize-none rounded-t-xl bg-neutral-100 px-5 py-4 text-neutral-900 !outline-none placeholder:text-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400"
        spellCheck={false}
      />
      <div className="inline-flex items-center justify-end gap-2 rounded-b-xl p-2">
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
  );
}
