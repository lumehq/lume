import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { NavArrowDownIcon } from '@shared/icons';
import { MemoizedTextKind, NoteActions, SubReply } from '@shared/notes';
import { User } from '@shared/user';
import { NDKEventWithReplies } from '@utils/types';

export function Reply({
  event,
  rootEvent,
}: {
  event: NDKEventWithReplies;
  rootEvent: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="rounded-xl bg-neutral-50 dark:bg-neutral-950">
        <div className="flex flex-col gap-2 pt-3">
          <User pubkey={event.pubkey} time={event.created_at} eventId={event.id} />
          <MemoizedTextKind content={event.content} />
          <div className="-ml-1 flex items-center justify-between">
            {event.replies?.length > 0 ? (
              <Collapsible.Trigger asChild>
                <div className="ml-4 inline-flex h-14 items-center gap-1 font-semibold text-blue-500">
                  <NavArrowDownIcon
                    className={twMerge('h-3 w-3', open ? 'rotate-180 transform' : '')}
                  />
                  {event.replies?.length +
                    ' ' +
                    (event.replies?.length === 1 ? 'reply' : 'replies')}
                </div>
              </Collapsible.Trigger>
            ) : null}
            <NoteActions event={event} rootEventId={rootEvent} canOpenEvent={false} />
          </div>
        </div>
        <div className={twMerge('px-3', open ? 'pb-3' : '')}>
          {event.replies?.length > 0 ? (
            <Collapsible.Content>
              {event.replies?.map((sub) => <SubReply key={sub.id} event={sub} />)}
            </Collapsible.Content>
          ) : null}
        </div>
      </div>
    </Collapsible.Root>
  );
}
