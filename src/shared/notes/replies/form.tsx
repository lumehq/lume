import { useState } from 'react';

import { Button } from '@shared/button';

import { useNostr } from '@utils/hooks/useNostr';
import { useProfile } from '@utils/hooks/useProfile';
import { displayNpub } from '@utils/shortenKey';

export function NoteReplyForm({ id, pubkey }: { id: string; pubkey: string }) {
  const { publish } = useNostr();
  const { status, user } = useProfile(pubkey);

  const [value, setValue] = useState('');

  const submit = () => {
    const tags = [['e', id, '', 'reply']];

    // publish event
    publish({ content: value, kind: 1, tags });

    // reset form
    setValue('');
  };

  return (
    <div className="mt-3 flex flex-col rounded-xl bg-neutral-200 dark:bg-neutral-800">
      <div className="relative w-full flex-1 overflow-hidden">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Reply to this thread..."
          className=" relative h-24 w-full resize-none rounded-md bg-transparent px-3 py-3 text-base text-neutral-900 !outline-none placeholder:text-neutral-600 dark:text-neutral-100 dark:placeholder:text-neutral-400"
          spellCheck={false}
        />
      </div>
      <div className="w-full border-t border-neutral-300 px-3 py-3 dark:border-neutral-700">
        {status === 'loading' ? (
          <div>Loading</div>
        ) : (
          <div className="flex w-full items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <div className="relative h-11 w-11 shrink-0 rounded">
                <img
                  src={user?.picture || user?.image}
                  alt={pubkey}
                  className="h-11 w-11 rounded-lg bg-white object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Reply as</p>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {user?.name || displayNpub(pubkey, 16)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => submit()}
                disabled={value.length === 0 ? true : false}
                preset="publish"
              >
                Reply
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
