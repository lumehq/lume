import Tooltip from '@lume/shared/tooltip';
import { channelReplyAtom } from '@lume/stores/channel';

import { Reply } from 'iconoir-react';
import { useSetAtom } from 'jotai';

export default function MessageReplyButton({ id, pubkey, content }: { id: string; pubkey: string; content: string }) {
  const setChannelReplyAtom = useSetAtom(channelReplyAtom);

  const createReply = () => {
    setChannelReplyAtom({ id: id, pubkey: pubkey, content: content });
  };

  return (
    <Tooltip message="Reply">
      <button
        onClick={() => createReply()}
        className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-800"
      >
        <Reply width={16} height={16} className="text-zinc-400" />
      </button>
    </Tooltip>
  );
}
