import { ChannelCreateModal } from "@app/channel/components/createModal";
import { ChannelsListItem } from "@app/channel/components/item";
import { useChannels } from "@stores/channels";
import { useEffect } from "react";

export function ChannelsList() {
	const channels = useChannels((state: any) => state.channels);
	const fetchChannels = useChannels((state: any) => state.fetch);

	useEffect(() => {
		fetchChannels();
	}, [fetchChannels]);

	return (
		<div className="flex flex-col">
			{!channels ? (
				<>
					<div className="inline-flex h-9 items-center gap-2 rounded-md px-2.5">
						<div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800" />
						<div className="h-3 w-full animate-pulse rounded-sm bg-zinc-800" />
					</div>
					<div className="inline-flex h-9 items-center gap-2 rounded-md px-2.5">
						<div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800" />
						<div className="h-3 w-full animate-pulse rounded-sm bg-zinc-800" />
					</div>
				</>
			) : (
				channels.map((item: { event_id: string }) => (
					<ChannelsListItem key={item.event_id} data={item} />
				))
			)}
			<ChannelCreateModal />
		</div>
	);
}
