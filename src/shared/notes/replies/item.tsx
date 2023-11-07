import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { NavArrowDownIcon } from '@shared/icons';
import { MemoizedTextKind, NoteActions, SubReply } from '@shared/notes';
import { User } from '@shared/user';

import { NDKEventWithReplies } from '@utils/types';

export function Reply({ event, root }: { event: NDKEventWithReplies; root?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-col gap-2">
        <User pubkey={event.pubkey} time={event.created_at} eventId={event.id} />
        <MemoizedTextKind content={event.content} />
        <div className="-ml-1">
          <NoteActions
            id={event.id}
            pubkey={event.pubkey}
            root={root}
            extraButtons={false}
          />
        </div>
      </div>
      <div className="pl-4">
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          {event.replies?.length > 0 ? (
            <div>
              <Collapsible.Trigger asChild>
                <div className="inline-flex h-10 items-center gap-1 font-semibold text-blue-500">
                  <NavArrowDownIcon
                    className={twMerge('h-3 w-3', open ? 'rotate-180 transform' : '')}
                  />
                  {event.replies?.length +
                    ' ' +
                    (event.replies?.length === 1 ? 'reply' : 'replies')}
                </div>
              </Collapsible.Trigger>
              <Collapsible.Content>
                {event.replies?.map((sub) => <SubReply key={sub.id} event={sub} />)}
              </Collapsible.Content>
            </div>
          ) : null}
        </Collapsible.Root>
      </div>
    </div>
  );
}
