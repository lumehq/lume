import { useState } from 'react';

import { Button } from '@shared/button';

import { FULL_RELAYS } from '@stores/constants';

import { usePublish } from '@utils/hooks/usePublish';

export function NoteReplyForm({ id }: { id: string }) {
  const publish = usePublish();
  const [value, setValue] = useState('');

  const submit = () => {
    const tags = [['e', id, FULL_RELAYS[0], 'reply']];

    // publish event
    publish({ content: value, kind: 1, tags });

    // reset form
    setValue('');
  };

  return (
    <div className="flex flex-col">
      <div className="relative w-full flex-1 overflow-hidden">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Reply to this thread..."
          className="relative h-20 w-full resize-none rounded-md bg-transparent px-5 py-3 text-base !outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          spellCheck={false}
        />
      </div>
      <div className="w-full border-t border-zinc-800 px-5 py-3">
        {status === 'loading' ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between">
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
