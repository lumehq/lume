import { ChannelMessageItem } from "@app/channel/components/messages/item";
import { useChannelMessages } from "@stores/channels";
import { getHourAgo } from "@utils/date";
import { useCallback, useRef } from "react";
import { Virtuoso } from "react-virtuoso";

export function ChannelMessageList() {
	const now = useRef(new Date());
	const virtuosoRef = useRef(null);

	const messages = useChannelMessages((state: any) => state.messages);
	const sorted = messages;

	const itemContent: any = useCallback(
		(index: string | number) => {
			return <ChannelMessageItem data={messages[index]} />;
		},
		[messages],
	);

	const computeItemKey = useCallback(
		(index: string | number) => {
			return messages[index].id;
		},
		[messages],
	);

	return (
		<div className="h-full w-full">
			<Virtuoso
				ref={virtuosoRef}
				data={messages}
				itemContent={itemContent}
				components={{
					Header: () => (
						<div className="relative py-4">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-zinc-800" />
							</div>
							<div className="relative flex justify-center">
								<div className="inline-flex items-center gap-x-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-base font-medium text-zinc-400 shadow-sm ring-1 ring-inset ring-zinc-800">
									{getHourAgo(24, now.current).toLocaleDateString("en-US", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</div>
							</div>
						</div>
					),
					EmptyPlaceholder: () => (
						<div className="flex flex-col gap-1 text-center">
							<h3 className="text-base font-semibold leading-none text-white">
								Nothing to see here yet
							</h3>
							<p className="text-base leading-none text-zinc-400">
								Be the first to share a message in this channel.
							</p>
						</div>
					),
				}}
				computeItemKey={computeItemKey}
				initialTopMostItemIndex={messages.length - 1}
				alignToBottom={true}
				followOutput={true}
				overscan={50}
				increaseViewportBy={{ top: 200, bottom: 200 }}
				className="scrollbar-hide h-full w-full overflow-y-auto"
			/>
		</div>
	);
}
