import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { NavArrowDownIcon } from '@shared/icons';
import { MemoizedTextNote, NoteActions, SubReply } from '@shared/notes';
import { User } from '@shared/user';

import { NDKEventWithReplies } from '@utils/types';

export function Reply({ event, root }: { event: NDKEventWithReplies; root?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="relative flex flex-col">
        <User pubkey={event.pubkey} time={event.created_at} eventId={event.id} />
        <div className="-mt-4 flex items-start gap-3">
          <div className="w-10 shrink-0" />
          <div className="flex-1">
            <MemoizedTextNote content={event.content} />
            <NoteActions
              id={event.id}
              pubkey={event.pubkey}
              root={root}
              extraButtons={false}
            />
          </div>
        </div>
      </div>
      <div className="pl-[48px]">
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
