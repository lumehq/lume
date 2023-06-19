import { ChatMessageItem } from "@app/chat/components/messages/item";
import { useActiveAccount } from "@stores/accounts";
import { useChatMessages } from "@stores/chats";
import { getHourAgo } from "@utils/date";
import { useCallback, useRef } from "react";
import { Virtuoso } from "react-virtuoso";

const now = new Date();

const Header = (
	<div className="relative py-4">
		<div className="absolute inset-0 flex items-center">
			<div className="w-full border-t border-zinc-800" />
		</div>
		<div className="relative flex justify-center">
			<div className="inline-flex items-center gap-x-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-400 shadow-sm ring-1 ring-inset ring-zinc-800">
				{getHourAgo(24, now).toLocaleDateString("en-US", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</div>
		</div>
	</div>
);

const Empty = (
	<div className="flex flex-col gap-1 text-center">
		<h3 className="text-base font-semibold leading-none text-white">
			Nothing to see here yet
		</h3>
		<p className="text-base leading-none text-zinc-400">
			You two didn't talk yet, let's send first message
		</p>
	</div>
);

export function ChatMessageList() {
	const account = useActiveAccount((state: any) => state.account);
	const messages = useChatMessages((state: any) => state.messages);

	const virtuosoRef = useRef(null);

	const itemContent: any = useCallback(
		(index: string | number) => {
			return (
				<ChatMessageItem
					data={messages[index]}
					userPubkey={account.pubkey}
					userPrivkey={account.privkey}
				/>
			);
		},
		[account.privkey, account.pubkey, messages],
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
				computeItemKey={computeItemKey}
				initialTopMostItemIndex={messages.length - 1}
				alignToBottom={true}
				followOutput={true}
				overscan={50}
				increaseViewportBy={{ top: 200, bottom: 200 }}
				className="scrollbar-hide h-full w-full overflow-y-auto"
				components={{
					Header: () => Header,
					EmptyPlaceholder: () => Empty,
				}}
			/>
		</div>
	);
}
