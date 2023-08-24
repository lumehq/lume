import { NDKEvent } from '@nostr-dev-kit/ndk';

import { useDecryptMessage } from '@app/chats/hooks/useDecryptMessage';

import { User } from '@shared/user';

export function ChatMessageItem({
  message,
  userPubkey,
  userPrivkey,
}: {
  message: NDKEvent;
  userPubkey: string;
  userPrivkey: string;
}) {
  const decryptedContent = useDecryptMessage(message, userPubkey, userPrivkey);
  // if we have decrypted content, use it instead of the encrypted content
  if (decryptedContent) {
    message['content'] = decryptedContent;
  }

  return (
    <div className="flex h-min min-h-min w-full select-text flex-col px-5 py-3 hover:bg-white/10">
      <div className="flex flex-col">
        <User pubkey={message.pubkey} time={message.created_at} isChat={true} />
        <div className="-mt-[20px] pl-[49px]">
          <p className="select-text whitespace-pre-line break-words text-base text-white">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
