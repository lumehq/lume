import { MessageUser } from '@components/chats/messageUser';

import { nip04 } from 'nostr-tools';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

const MessageListItem = ({
  data,
  activeAccountPubkey,
  activeAccountPrivkey,
}: {
  data: any;
  activeAccountPubkey: string;
  activeAccountPrivkey: string;
}) => {
  const [content, setContent] = useState('');

  const sender = useMemo(() => {
    const pTag = data.tags.find(([k, v]) => k === 'p' && v && v !== '')[1];
    if (pTag === activeAccountPubkey) {
      return data.pubkey;
    } else {
      return pTag;
    }
  }, [data.pubkey, data.tags, activeAccountPubkey]);

  const decryptContent = useCallback(async () => {
    const result = await nip04.decrypt(activeAccountPrivkey, sender, data.content);
    setContent(result);
  }, [data.content, activeAccountPrivkey, sender]);

  useEffect(() => {
    decryptContent().catch(console.error);
  }, [decryptContent]);

  return (
    <div className="flex h-min min-h-min w-full select-text flex-col px-5 py-2 hover:bg-black/20">
      <div className="flex flex-col">
        <MessageUser pubkey={data.pubkey} time={data.created_at} />
        <div className="-mt-[17px] pl-[48px]">
          <div className="flex flex-col gap-2">
            <div className="prose prose-zinc max-w-none break-words text-sm leading-tight dark:prose-invert prose-p:m-0 prose-p:text-sm prose-p:leading-tight prose-a:font-normal prose-a:text-fuchsia-500 prose-a:no-underline prose-img:m-0 prose-video:m-0">
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MessageListItem);
