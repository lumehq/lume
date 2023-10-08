import { nip04 } from 'nostr-tools';
import { useCallback, useState } from 'react';

import { MediaUploader } from '@app/chats/components/mediaUploader';

import { EnterIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function ChatForm({
  receiverPubkey,
  userPrivkey,
}: {
  receiverPubkey: string;
  userPubkey: string;
  userPrivkey: string;
}) {
  const { publish } = useNostr();
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
    shiftKey: KeyboardEvent['shiftKey'];
    preventDefault: () => void;
  }) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <MediaUploader setState={setValue} />
      <div className="flex w-full items-center justify-between rounded-full bg-zinc-300 px-3 dark:bg-zinc-700">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleEnterPress}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Message"
          className="h-10 flex-1 resize-none bg-transparent px-3 text-zinc-900 placeholder:text-zinc-500 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-300"
        />
        <button
          type="button"
          onClick={submit}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-300"
        >
          <EnterIcon className="h-5 w-5" />
          Send
        </button>
      </div>
    </div>
  );
}
