import { ChannelMessageItem } from "../components/messages/item";
import { ChannelMembers } from "@app/channel/components/members";
import { ChannelMessageForm } from "@app/channel/components/messages/form";
import { ChannelMetadata } from "@app/channel/components/metadata";
import { RelayContext } from "@shared/relayProvider";
import { useChannelMessages } from "@stores/channels";
import { useVirtualizer } from "@tanstack/react-virtual";
import { dateToUnix, getHourAgo } from "@utils/date";
import { usePageContext } from "@utils/hooks/usePageContext";
import { useCallback, useContext, useEffect, useRef } from "react";
import useSWRSubscription from "swr/subscription";

const now = new Date();
const since = dateToUnix(getHourAgo(24, now));

export function Page() {
	const ndk = useContext(RelayContext);
	const pageContext = usePageContext();

	const searchParams: any = pageContext.urlParsed.search;
	const channelID = searchParams.id;

	const [messages, addMessage, fetchMessages, clearMessages]: any =
		useChannelMessages((state: any) => [
			state.messages,
			state.addMessage,
			state.fetch,
			state.clear,
		]);

	useSWRSubscription(["channelMessagesSubscribe", channelID], () => {
		// subscribe to channel
		const sub = ndk.subscribe({
			"#e": [channelID],
			kinds: [42],
			since: dateToUnix(),
		});

		sub.addListener("event", (event) => {
			addMessage(event);
		});

		return () => {
			sub.stop();
		};
	});

	useEffect(() => {
		fetchMessages(ndk, channelID, since);
		return () => {
			clearMessages();
		};
	}, [fetchMessages]);

	const count = messages.length;
	const reverseIndex = useCallback((index) => count - 1 - index, [count]);
	const parentRef = useRef();
	const virtualizerRef = useRef(null);

	if (
		virtualizerRef.current &&
		count !== virtualizerRef.current.options.count
	) {
		const delta = count - virtualizerRef.current.options.count;
		const nextOffset = virtualizerRef.current.scrollOffset + delta * 200;

		virtualizerRef.current.scrollOffset = nextOffset;
		virtualizerRef.current.scrollToOffset(nextOffset, { align: "start" });
	}

	const virtualizer = useVirtualizer({
		count,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 200,
		getItemKey: useCallback(
			(index) => messages[reverseIndex(index)].id,
			[messages, reverseIndex],
		),
		overscan: 5,
		scrollMargin: 50,
	});

	useEffect(() => {
		virtualizerRef.current = virtualizer;
	}, []);

	const items = virtualizer.getVirtualItems();

	const [paddingTop, paddingBottom] =
		items.length > 0
			? [
					Math.max(0, items[0].start - virtualizer.options.scrollMargin),
					Math.max(0, virtualizer.getTotalSize() - items[items.length - 1].end),
			  ]
			: [0, 0];

	return (
		<div className="h-full w-full grid grid-cols-3">
			<div className="col-span-2 flex flex-col justify-between border-r border-zinc-900">
				<div
					data-tauri-drag-region
					className="h-11 w-full shrink-0 inline-flex items-center justify-center border-b border-zinc-900"
				>
					<h3 className="font-semibold text-zinc-100">Public Channel</h3>
				</div>
				<div className="w-full flex-1 p-3">
					<div className="flex h-full flex-col justify-between rounded-md bg-zinc-900">
						<div
							ref={parentRef}
							className="scrollbar-hide overflow-y-auto h-full w-full"
							style={{ contain: "strict" }}
						>
							{!messages ? (
								<p>Loading...</p>
							) : (
								<div
									style={{
										overflowAnchor: "none",
										paddingTop,
										paddingBottom,
									}}
								>
									{items.map((item) => {
										const index = reverseIndex(item.index);
										const message = messages[index];

										return (
											<div
												key={item.key}
												data-index={item.index}
												data-reverse-index={index}
												ref={virtualizer.measureElement}
											>
												<ChannelMessageItem data={message} />
											</div>
										);
									})}
								</div>
							)}
						</div>
						<div className="w-full inline-flex shrink-0 border-t border-zinc-800">
							<ChannelMessageForm channelID={channelID} />
						</div>
					</div>
				</div>
			</div>
			<div className="col-span-1 flex flex-col">
				<div
					data-tauri-drag-region
					className="h-11 w-full shrink-0 inline-flex items-center justify-center border-b border-zinc-900"
				/>
				<div className="p-3 flex flex-col gap-3">
					<ChannelMetadata id={channelID} />
					<ChannelMembers />
				</div>
			</div>
		</div>
	);
}
