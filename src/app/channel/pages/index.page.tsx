import { ChannelMessageItem } from "../components/messages/item";
import { ChannelMembers } from "@app/channel/components/members";
import { ChannelMessageForm } from "@app/channel/components/messages/form";
import { ChannelMetadata } from "@app/channel/components/metadata";
import { RelayContext } from "@shared/relayProvider";
import { useChannelMessages } from "@stores/channels";
import { dateToUnix } from "@utils/date";
import { usePageContext } from "@utils/hooks/usePageContext";
import { LumeEvent } from "@utils/types";
import { useCallback, useContext, useEffect, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWRSubscription from "swr/subscription";

export function Page() {
	const ndk = useContext(RelayContext);
	const pageContext = usePageContext();
	const virtuosoRef = useRef(null);

	const searchParams: any = pageContext.urlParsed.search;
	const channelID = searchParams.id;

	const [messages, fetchMessages, addMessage, clearMessages] =
		useChannelMessages((state: any) => [
			state.messages,
			state.fetch,
			state.add,
			state.clear,
		]);

	useSWRSubscription(
		channelID ? ["channelMessagesSubscribe", channelID] : null,
		() => {
			// subscribe to channel
			const sub = ndk.subscribe(
				{
					"#e": [channelID],
					kinds: [42],
					since: dateToUnix(),
				},
				{ closeOnEose: false },
			);

			sub.addListener("event", (event: LumeEvent) => {
				addMessage(channelID, event);
			});

			return () => {
				sub.stop();
			};
		},
	);

	useEffect(() => {
		fetchMessages(channelID);

		return () => {
			clearMessages();
		};
	}, [fetchMessages]);

	const itemContent: any = useCallback(
		(index: string | number) => {
			return <ChannelMessageItem data={messages[index]} />;
		},
		[messages],
	);

	const computeItemKey = useCallback(
		(index: string | number) => {
			return messages[index].event_id;
		},
		[messages],
	);

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
						{!messages ? (
							<p>Loading...</p>
						) : (
							<Virtuoso
								ref={virtuosoRef}
								data={messages}
								itemContent={itemContent}
								computeItemKey={computeItemKey}
								initialTopMostItemIndex={messages.length - 1}
								alignToBottom={true}
								followOutput={true}
								overscan={50}
								increaseViewportBy={{ top: 200, bottom: 200 }}
								className="scrollbar-hide overflow-y-auto h-full w-full"
							/>
						)}
						<div className="w-full inline-flex shrink-0 px-5 py-3 border-t border-zinc-800">
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
