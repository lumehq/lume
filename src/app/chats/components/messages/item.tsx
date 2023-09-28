import { NDKEvent } from '@nostr-dev-kit/ndk';

import { useDecryptMessage } from '@app/chats/hooks/useDecryptMessage';

import { TextNote } from '@shared/notes';
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
        <User pubkey={message.pubkey} time={message.created_at} variant="chat" />
        <div className="-mt-5 flex items-start gap-3">
          <div className="w-10 shrink-0" />
          <TextNote content={message.content} />
        </div>
      </div>
    </div>
  );
}
