import { useDecryptMessage } from '@app/chats/hooks/useDecryptMessage';

import { NoteContent } from '@shared/notes';
import { User } from '@shared/user';

import { parser } from '@utils/parser';

export function ChatMessageItem({
  data,
  userPubkey,
  userPrivkey,
}: {
  data: any;
  userPubkey: string;
  userPrivkey: string;
}) {
  const decryptedContent = useDecryptMessage(data, userPubkey, userPrivkey);
  // if we have decrypted content, use it instead of the encrypted content
  if (decryptedContent) {
    data['content'] = decryptedContent;
  }

  return (
    <div className="flex h-min min-h-min w-full select-text flex-col px-5 py-3 hover:bg-white/10">
      <div className="flex flex-col">
        <User pubkey={data.sender_pubkey} time={data.created_at} isChat={true} />
        <div className="-mt-[20px] pl-[49px]">
          <p className="select-text whitespace-pre-line break-words text-base text-white">
            {data.content}
          </p>
        </div>
      </div>
    </div>
  );
}
