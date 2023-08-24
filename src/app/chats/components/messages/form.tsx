import { nip04 } from 'nostr-tools';
import { useCallback, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { MediaUploader } from '@app/chats/components/messages/mediaUploader';

import { EnterIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function ChatMessageForm({
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
    <div className="flex w-full items-center justify-between rounded-md bg-white/20 px-3">
      <TextareaAutosize
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleEnterPress}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Message"
        className="min-h-[44px] flex-1 resize-none bg-transparent py-3 text-white !outline-none placeholder:text-white"
      />
      <div className="inline-flex items-center gap-2">
        <MediaUploader setState={setValue} />
        <button
          type="button"
          onClick={submit}
          className="inline-flex items-center gap-1.5 text-sm font-medium leading-none text-white/50"
        >
          <EnterIcon className="h-5 w-5" />
          Send
        </button>
      </div>
    </div>
  );
}
