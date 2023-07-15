import * as Tooltip from '@radix-ui/react-tooltip';

import { NoteReaction } from '@shared/notes/actions/reaction';
import { NoteReply } from '@shared/notes/actions/reply';
import { NoteRepost } from '@shared/notes/actions/repost';
import { NoteZap } from '@shared/notes/actions/zap';

export function NoteActions({
  id,
  rootID,
  eventPubkey,
}: {
  id: string;
  rootID?: string;
  eventPubkey: string;
}) {
  return (
    <Tooltip.Provider>
      <div className="-ml-1 mt-4 inline-flex w-full items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <NoteReaction />
          <NoteZap />
          <NoteRepost id={id} pubkey={eventPubkey} />
          <NoteReply id={id} rootID={rootID} pubkey={eventPubkey} />
        </div>
      </div>
    </Tooltip.Provider>
  );
}
