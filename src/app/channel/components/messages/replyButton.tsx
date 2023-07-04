import { ReplyMessageIcon } from '@shared/icons';
import { Tooltip } from '@shared/tooltip_dep';

import { useChannelMessages } from '@stores/channels';

export function MessageReplyButton({
  id,
  pubkey,
  content,
}: {
  id: string;
  pubkey: string;
  content: string;
}) {
  const openReply = useChannelMessages((state: any) => state.openReply);

  const createReply = () => {
    openReply(id, pubkey, content);
  };

  return (
    <Tooltip message="Reply to message">
      <button
        type="button"
        onClick={() => createReply()}
        className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-zinc-800"
      >
        <ReplyMessageIcon width={16} height={16} className="text-zinc-200" />
      </button>
    </Tooltip>
  );
}
