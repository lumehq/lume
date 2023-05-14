import ChatsListItem from "@app/chat/components/item";
import ChatsListSelfItem from "@app/chat/components/self";

import { useActiveAccount } from "@utils/hooks/useActiveAccount";
import { getChats } from "@utils/storage";

import useSWR from "swr";

const fetcher = ([, account]) => getChats(account);

export default function ChatsList() {
	const { account, isLoading, isError } = useActiveAccount();
	const { data: chats, error }: any = useSWR(
		!isLoading && !isError && account ? ["chats", account] : null,
		fetcher,
	);

	return (
		<div className="flex flex-col gap-px">
			<ChatsListSelfItem />
			{!chats || error ? (
				<>
					<div className="inline-flex h-8 items-center gap-2 rounded-md px-2.5">
						<div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800" />
						<div className="h-3 w-full animate-pulse bg-zinc-800" />
					</div>
					<div className="inline-flex h-8 items-center gap-2 rounded-md px-2.5">
						<div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800" />
						<div className="h-3 w-full animate-pulse bg-zinc-800" />
					</div>
				</>
			) : (
				chats.map((item: { pubkey: string }) => (
					<ChatsListItem key={item.pubkey} pubkey={item.pubkey} />
				))
			)}
		</div>
	);
}
