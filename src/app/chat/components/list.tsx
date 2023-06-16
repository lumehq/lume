import { ChatsListItem } from "@app/chat/components/item";
import { ChatsListSelfItem } from "@app/chat/components/self";
import { useActiveAccount } from "@stores/accounts";
import { useChats } from "@stores/chats";
import { useEffect } from "react";

export function ChatsList() {
	const account = useActiveAccount((state: any) => state.account);
	const chats = useChats((state: any) => state.chats);
	const fetchChats = useChats((state: any) => state.fetch);

	useEffect(() => {
		if (!account) return;
		fetchChats(account.pubkey);
	}, [fetchChats]);

	if (!account)
		return (
			<div className="flex flex-col gap-0.5">
				<div className="inline-flex h-9 items-center gap-2 rounded-md px-2.5">
					<div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800" />
					<div className="h-3 w-full rounded-sm animate-pulse bg-zinc-800" />
				</div>
				<div className="inline-flex h-9 items-center gap-2 rounded-md px-2.5">
					<div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800" />
					<div className="h-3 w-full rounded-sm animate-pulse bg-zinc-800" />
				</div>
			</div>
		);

	return (
		<div className="flex flex-col gap-0.5">
			<ChatsListSelfItem data={account} />
			{!chats ? (
				<>
					<div className="inline-flex h-9 items-center gap-2 rounded-md px-2.5">
						<div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800" />
						<div className="h-3 w-full rounded-sm animate-pulse bg-zinc-800" />
					</div>
					<div className="inline-flex h-9 items-center gap-2 rounded-md px-2.5">
						<div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800" />
						<div className="h-3 w-full rounded-sm animate-pulse bg-zinc-800" />
					</div>
				</>
			) : (
				chats.map((item) => {
					if (account.pubkey !== item.sender_pubkey) {
						return <ChatsListItem key={item.sender_pubkey} data={item} />;
					}
				})
			)}
		</div>
	);
}
