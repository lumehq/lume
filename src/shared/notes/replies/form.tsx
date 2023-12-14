import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useArk } from '@libs/ark';
import { LoaderIcon } from '@shared/icons';
import { ReplyMediaUploader } from '@shared/notes';

export function NoteReplyForm({ rootEvent }: { rootEvent: NDKEvent }) {
  const ark = useArk();
  const navigate = useNavigate();

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      if (!ark.readyToSign) return navigate('/new/privkey');
      setLoading(true);

      // publish event
      const publish = await ark.replyTo({ content: value, event: rootEvent });

      if (publish) {
        toast.success(`Broadcasted to ${publish.size} relays successfully.`);

        // reset state
        setValue('');
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  return (
    <div className="mt-3 flex flex-col rounded-xl bg-neutral-50 dark:bg-neutral-950">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Reply to this post..."
        className="h-28 w-full resize-none rounded-t-xl border-transparent bg-neutral-100 px-5 py-4 text-neutral-900 !outline-none placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
        spellCheck={false}
      />
      <div className="inline-flex items-center justify-end gap-2 rounded-b-xl p-2">
        <ReplyMediaUploader setValue={setValue} />
        <button
          onClick={() => submit()}
          disabled={value.length === 0 ? true : false}
          className="inline-flex h-9 w-20 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? <LoaderIcon className="h-4 w-4 animate-spin" /> : 'Reply'}
        </button>
      </div>
    </div>
  );
}
