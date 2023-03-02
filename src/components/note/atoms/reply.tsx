/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

export default function Reply({ eventID }: { eventID: string }) {
  console.log(eventID);
  const [count] = useState(0);

  return (
    <button className="group flex w-16 items-center gap-1.5 text-sm text-zinc-500">
      <div className="rounded-lg p-1 group-hover:bg-zinc-600">
        <ChatBubbleIcon className="h-4 w-4 group-hover:text-orange-400" />
      </div>
      <span>{count}</span>
    </button>
  );
}
