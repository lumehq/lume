import { MessageList } from '@components/columns/navigator/messages/list';

import * as Collapsible from '@radix-ui/react-collapsible';
import { TriangleUpIcon } from '@radix-ui/react-icons';
import useLocalStorage from '@rehooks/local-storage';
import { useState } from 'react';

export default function Messages() {
  const [open, setOpen] = useState(true);
  const [follows] = useLocalStorage('follows');

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-1 px-2 pb-8">
        <Collapsible.Trigger className="flex cursor-pointer items-center gap-2 rounded-md py-1 px-2 hover:bg-zinc-900">
          <div
            className={`inline-flex h-6 w-6 transform items-center justify-center transition-transform duration-150 ease-in-out ${
              open ? 'rotate-180' : ''
            }`}
          >
            <TriangleUpIcon className="h-4 w-4 text-zinc-500" />
          </div>
          <h3 className="bg-gradient-to-r from-red-300 via-pink-100 to-blue-300 bg-clip-text text-xs font-bold uppercase tracking-wide text-transparent">
            Messages
          </h3>
        </Collapsible.Trigger>
        <Collapsible.Content className="flex flex-col">
          <MessageList data={follows} />
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
