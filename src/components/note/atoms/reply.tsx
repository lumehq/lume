import ReplyIcon from '@assets/icons/Reply';

import { useNostrEvents } from 'nostr-react';

export default function Reply({ eventID }: { eventID: string }) {
  const { events } = useNostrEvents({
    filter: {
      '#e': [eventID],
      since: 0,
      kinds: [1],
      limit: 10,
    },
  });

  return (
    <button className="group flex w-16 items-center gap-1.5 text-sm text-zinc-500">
      <div className="rounded-lg p-1 group-hover:bg-zinc-800">
        <ReplyIcon />
      </div>
      <span>{events.length || 0}</span>
    </button>
  );
}
