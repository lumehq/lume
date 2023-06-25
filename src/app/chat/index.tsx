import { ChatMessageForm } from "@app/chat/components/messages/form";
import { ChatMessageItem } from "@app/chat/components/messages/item";
import { ChatSidebar } from "@app/chat/components/sidebar";
import { getChatMessages } from "@libs/storage";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@utils/hooks/useAccount";
import { useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";

export function ChatScreen() {
	const virtuosoRef = useRef(null);

	const { pubkey } = useParams();
	const { account } = useAccount();
	const { status, data } = useQuery(
		["chat", pubkey],
		async () => {
			return await getChatMessages(account.pubkey, pubkey);
		},
		{
			enabled: account ? true : false,
		},
	);

	const itemContent: any = useCallback(
		(index: string | number) => {
			return (
				<ChatMessageItem
					data={data[index]}
					userPubkey={account.pubkey}
					userPrivkey={account.privkey}
				/>
			);
		},
		[data],
	);

	const computeItemKey = useCallback(
		(index: string | number) => {
			return data[index].id;
		},
		[data],
	);

	return (
		<div className="h-full w-full grid grid-cols-3">
			<div className="col-span-2 flex flex-col justify-between border-r border-zinc-900">
				<div
					data-tauri-drag-region
					className="h-11 w-full shrink-0 inline-flex items-center justify-center border-b border-zinc-900"
				>
					<h3 className="font-semibold text-zinc-100">Encrypted Chat</h3>
				</div>
				<div className="w-full h-full flex-1 p-3">
					<div className="h-full flex flex-col justify-between rounded-xl border-t border-zinc-800/50 bg-zinc-900 overflow-hidden">
						<div className="flex-1 w-full h-full">
							{status === "loading" ? (
								<p>Loading...</p>
							) : (
								<Virtuoso
									ref={virtuosoRef}
									data={data}
									itemContent={itemContent}
									computeItemKey={computeItemKey}
									initialTopMostItemIndex={data.length - 1}
									alignToBottom={true}
									followOutput={true}
									overscan={50}
									increaseViewportBy={{ top: 200, bottom: 200 }}
									className="relative scrollbar-hide overflow-y-auto"
									components={{
										EmptyPlaceholder: () => Empty,
									}}
								/>
							)}
						</div>
						<div className="shrink-0 px-5 p-3 rounded-b-xl border-t border-zinc-800 bg-zinc-900 z-50">
							<ChatMessageForm
								receiverPubkey={pubkey}
								userPubkey={account.pubkey}
								userPrivkey={account.privkey}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="col-span-1">
				<div
					data-tauri-drag-region
					className="h-11 w-full shrink-0 inline-flex items-center justify-center border-b border-zinc-900"
				/>
				<ChatSidebar pubkey={pubkey} />
			</div>
		</div>
	);
}

const Empty = (
	<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex flex-col gap-1 text-center">
		<h3 className="mb-2 text-4xl">🙌</h3>
		<p className="leading-none text-zinc-400">
			You two didn't talk yet, let's send first message
		</p>
	</div>
);
