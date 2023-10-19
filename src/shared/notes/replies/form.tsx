import { useState } from 'react';

import { useStorage } from '@libs/storage/provider';

import { User } from '@shared/user';

import { useNostr } from '@utils/hooks/useNostr';

export function NoteReplyForm({ id }: { id: string }) {
  const { publish } = useNostr();
  const { db } = useStorage();

  const [value, setValue] = useState('');

  const submit = () => {
    const tags = [['e', id, '', 'reply']];

    // publish event
    publish({ content: value, kind: 1, tags });

    // reset form
    setValue('');
  };

  return (
    <div className="mt-3 flex gap-3">
      <User pubkey={db.account.pubkey} variant="miniavatar" />
      <div className="relative flex flex-1 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Reply to this thread..."
          className="relative h-24 w-full resize-none bg-transparent p-3 text-base text-neutral-900 !outline-none placeholder:text-neutral-600 dark:text-neutral-100 dark:placeholder:text-neutral-400"
          spellCheck={false}
        />
        <button
          onClick={() => submit()}
          disabled={value.length === 0 ? true : false}
          className="mb-2 ml-auto mr-2 h-9 w-20 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Reply
        </button>
      </div>
    </div>
  );
}
