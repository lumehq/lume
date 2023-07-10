import { useState } from 'react';

import { Button } from '@shared/button';
import { Image } from '@shared/image';

import { DEFAULT_AVATAR, FULL_RELAYS } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { usePublish } from '@utils/hooks/usePublish';
import { shortenKey } from '@utils/shortenKey';

export function NoteReplyForm({
  rootID,
  userPubkey,
}: {
  rootID: string;
  userPubkey: string;
}) {
  const publish = usePublish();
  const { status, user } = useProfile(userPubkey);
  const [value, setValue] = useState('');

  const submit = () => {
    const tags = [['e', rootID, FULL_RELAYS[0], 'root']];

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
            <div className="inline-flex items-center gap-2">
              <div className="relative h-9 w-9 shrink-0 rounded">
                <Image
                  src={user.image}
                  fallback={DEFAULT_AVATAR}
                  alt={userPubkey}
                  className="h-9 w-9 rounded-md bg-white object-cover"
                />
              </div>
              <div>
                <p className="mb-px text-sm leading-none text-zinc-400">Reply as</p>
                <p className="text-sm font-medium leading-none text-zinc-100">
                  {user.nip05 || user.name || shortenKey(userPubkey)}
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
