import { ChatMessageItem } from "@app/chat/components/messages/item";
import { useActiveAccount } from "@stores/accounts";
import { useChatMessages } from "@stores/chats";
import { useCallback, useRef } from "react";
import { Virtuoso } from "react-virtuoso";

export function ChatMessageList() {
	const account = useActiveAccount((state: any) => state.account);
	const messages = useChatMessages((state: any) => state.messages);

	const virtuosoRef = useRef(null);

	const itemContent: any = useCallback(
		(index: string | number) => {
			return (
				<ChatMessageItem data={messages[index]} userPrivkey={account.privkey} />
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
			/>
		</div>
	);
}
