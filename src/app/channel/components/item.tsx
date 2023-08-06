import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { useChannelProfile } from '@app/channel/hooks/useChannelProfile';

export function ChannelsListItem({ data }: { data: any }) {
  const channel = useChannelProfile(data.event_id);
  return (
    <NavLink
      to={`/channel/${data.event_id}`}
      preventScrollReset={true}
      className={({ isActive }) =>
        twMerge(
          'inline-flex h-9 items-center gap-2.5 rounded-md px-2.5',
          isActive ? 'bg-zinc-900/50 text-white' : ''
        )
      }
    >
      <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-800/50 bg-zinc-900">
        <span className="text-xs text-white">#</span>
      </div>
      <div className="inline-flex w-full items-center justify-between">
        <h5 className="truncate font-medium text-zinc-200">{channel?.name}</h5>
        <div className="flex items-center">
          {data.new_messages && (
            <span className="inline-flex w-8 items-center justify-center rounded bg-fuchsia-400/10 px-1 py-1 text-xs font-medium text-fuchsia-500 ring-1 ring-inset ring-fuchsia-400/20">
              {data.new_messages}
            </span>
          )}
        </div>
      </div>
    </NavLink>
  );
}
