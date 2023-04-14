import ChatList from '@components/chats/chatList';

import * as Collapsible from '@radix-ui/react-collapsible';
import { NavArrowUp } from 'iconoir-react';
import { useState } from 'react';

export default function Chats() {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="flex flex-col px-2">
        <Collapsible.Trigger className="flex cursor-pointer items-center gap-1 px-1 py-1">
          <div
            className={`inline-flex h-5 w-5 transform items-center justify-center transition-transform duration-150 ease-in-out ${
              open ? 'rotate-180' : ''
            }`}
          >
            <NavArrowUp width={16} height={16} className="text-zinc-700" />
          </div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Chats</h3>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <ChatList />
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
