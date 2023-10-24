import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { nip04 } from 'nostr-tools';
import { useCallback, useState } from 'react';

import { MediaUploader } from '@app/chats/components/mediaUploader';

import { useNDK } from '@libs/ndk/provider';

import { EnterIcon } from '@shared/icons';

export function ChatForm({
  receiverPubkey,
  userPrivkey,
}: {
  receiverPubkey: string;
  userPubkey: string;
  userPrivkey: string;
}) {
  const { ndk } = useNDK();
  const [value, setValue] = useState('');

  const encryptMessage = useCallback(async () => {
    return await nip04.encrypt(userPrivkey, receiverPubkey, value);
  }, [receiverPubkey, value]);

  const submit = async () => {
    const message = await encryptMessage();
    const tags = [['p', receiverPubkey]];

    const event = new NDKEvent(ndk);
    event.content = message;
    event.kind = NDKKind.EncryptedDirectMessage;
    event.tags = tags;

    await event.publish();

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
      <div className="flex w-full items-center justify-between rounded-full bg-neutral-300 px-3 dark:bg-neutral-700">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleEnterPress}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Message"
          className="h-10 flex-1 resize-none bg-transparent px-3 text-neutral-900 placeholder:text-neutral-600 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-300"
        />
        <button
          type="button"
          onClick={submit}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-300"
        >
          <EnterIcon className="h-5 w-5" />
          Send
        </button>
      </div>
    </div>
  );
}
