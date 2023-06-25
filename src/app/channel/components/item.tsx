import { useChannelProfile } from "@app/channel/hooks/useChannelProfile";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export function ChannelsListItem({ data }: { data: any }) {
	const channel = useChannelProfile(data.event_id);
	return (
		<NavLink
			to={`/app/channel/${data.event_id}`}
			preventScrollReset={true}
			className={({ isActive }) =>
				twMerge(
					"inline-flex h-9 items-center gap-2.5 rounded-md px-2.5",
					isActive ? "bg-zinc-900/50 text-zinc-100" : "",
				)
			}
		>
			<div className="inline-flex shrink-0 h-6 w-6 items-center justify-center rounded border-t border-zinc-800/50 bg-zinc-900">
				<span className="text-xs text-zinc-100">#</span>
			</div>
			<div className="w-full inline-flex items-center justify-between">
				<h5 className="truncate font-medium text-zinc-200">{channel?.name}</h5>
				<div className="flex items-center">
					{data.new_messages && (
						<span className="inline-flex items-center justify-center rounded bg-fuchsia-400/10 w-8 px-1 py-1 text-xs font-medium text-fuchsia-500 ring-1 ring-inset ring-fuchsia-400/20">
							{data.new_messages}
						</span>
					)}
				</div>
			</div>
		</NavLink>
	);
}
