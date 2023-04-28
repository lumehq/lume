import ChatMessageUser from '@lume/app/chat/components/messages/user';
import { useDecryptMessage } from '@lume/utils/hooks/useDecryptMessage';

import { memo } from 'react';

export const ChatMessageItem = memo(function MessageListItem({
  data,
  userPubkey,
  userPrivkey,
}: {
  data: any;
  userPubkey: string;
  userPrivkey: string;
}) {
  const content = useDecryptMessage(userPubkey, userPrivkey, data.pubkey, data.tags, data.content);

  return (
    <div className="flex h-min min-h-min w-full select-text flex-col px-5 py-2 hover:bg-black/20">
      <div className="flex flex-col">
        <ChatMessageUser pubkey={data.pubkey} time={data.created_at} />
        <div className="-mt-[17px] pl-[48px]">
          <div className="whitespace-pre-line break-words break-words text-sm leading-tight">{content}</div>
        </div>
      </div>
    </div>
  );
});
