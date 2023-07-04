import { nip04 } from 'nostr-tools';
import { useCallback, useState } from 'react';

import { usePublish } from '@libs/ndk';

import { EnterIcon } from '@shared/icons';
import { MediaUploader } from '@shared/mediaUploader';

export function ChatMessageForm({
  receiverPubkey,
  userPrivkey,
}: {
  receiverPubkey: string;
  userPubkey: string;
  userPrivkey: string;
}) {
  const publish = usePublish();
  const [value, setValue] = useState('');

  const encryptMessage = useCallback(async () => {
    return await nip04.encrypt(userPrivkey, receiverPubkey, value);
  }, [receiverPubkey, value]);

  const submit = async () => {
    const message = await encryptMessage();
    const tags = [['p', receiverPubkey]];

    // publish message
    await publish({ content: message, kind: 4, tags });

    // reset state
    setValue('');
  };

  const handleEnterPress = (e: {
    key: string;
    shiftKey: any;
    preventDefault: () => void;
  }) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="relative h-11 w-full">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleEnterPress}
        spellCheck={false}
        placeholder="Message"
        className="relative h-11 w-full resize-none rounded-md bg-zinc-800 px-5 !outline-none placeholder:text-zinc-500"
      />
      <div className="absolute right-2 top-0 h-11">
        <div className="flex h-full items-center justify-end gap-3 text-zinc-500">
          <MediaUploader setState={setValue} />
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center gap-1 text-sm leading-none"
          >
            <EnterIcon width={14} height={14} className="" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
