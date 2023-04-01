import * as Collapsible from '@radix-ui/react-collapsible';
import { TriangleUpIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

export default function Channels() {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-1 px-2">
        <Collapsible.Trigger className="flex cursor-pointer items-center gap-2 px-2 py-1">
          <div
            className={`inline-flex h-6 w-6 transform items-center justify-center transition-transform duration-150 ease-in-out ${
              open ? 'rotate-180' : ''
            }`}
          >
            <TriangleUpIcon className="h-4 w-4 text-zinc-700" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-600">Channels</h3>
        </Collapsible.Trigger>
        <Collapsible.Content></Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
