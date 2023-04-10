import { CreateChannelModal } from '@components/channels/createChannelModal';

import { GlobeIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function ChannelList() {
  return (
    <div className="flex flex-col gap-px">
      <Link
        href="/channels"
        className="group inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-950"
      >
        <div className="inline-flex h-5 w-5 shrink items-center justify-center rounded bg-zinc-900">
          <GlobeIcon className="h-3 w-3 text-zinc-500" />
        </div>
        <div>
          <h5 className="text-sm font-medium text-zinc-500 group-hover:text-zinc-400">Browse channels</h5>
        </div>
      </Link>
      <CreateChannelModal />
    </div>
  );
}
