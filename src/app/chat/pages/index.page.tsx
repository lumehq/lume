import { ChatSidebar } from "../components/sidebar";
import { ChatMessageList } from "@app/chat/components/messageList";
import { ChatMessageForm } from "@app/chat/components/messages/form";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { useChatMessages } from "@stores/chats";
import { READONLY_RELAYS } from "@stores/constants";
import { dateToUnix } from "@utils/date";
import { usePageContext } from "@utils/hooks/usePageContext";
import { useContext, useEffect } from "react";
import useSWRSubscription from "swr/subscription";

export function Page() {
	const pool: any = useContext(RelayContext);
	const account = useActiveAccount((state: any) => state.account);

	const pageContext = usePageContext();
	const searchParams: any = pageContext.urlParsed.search;
	const pubkey = searchParams.pubkey;

	const [fetchMessages, clear] = useChatMessages((state: any) => [
		state.fetch,
		state.clear,
	]);
	const add = useChatMessages((state: any) => state.add);

	useSWRSubscription(
		account.pubkey !== pubkey ? ["chat", pubkey] : null,
		() => {
			const unsubscribe = pool.subscribe(
				[
					{
						kinds: [4],
						authors: [pubkey],
						"#p": [account.pubkey],
						since: dateToUnix(),
					},
				],
				READONLY_RELAYS,
				(event: any) => {
					add(account.pubkey, event);
				},
			);

			return () => {
				unsubscribe();
			};
		},
	);

	useEffect(() => {
		fetchMessages(account.pubkey, pubkey);

		return () => {
			clear();
		};
	}, [pubkey, fetchMessages]);

	if (!account) return <div>Fuck SSR</div>;

	return (
		<div className="h-full w-full grid grid-cols-3">
			<div className="col-span-2 flex flex-col justify-between border-r border-zinc-900">
				<div
					data-tauri-drag-region
					className="h-11 w-full shrink-0 inline-flex items-center justify-center border-b border-zinc-900"
				>
					<h3 className="font-semibold text-zinc-100">Encrypted Chat</h3>
				</div>
				<div className="w-full flex-1 p-3">
					<div className="flex h-full flex-col justify-between rounded-md bg-zinc-900 shadow-input shadow-black/20">
						<ChatMessageList />
						<div className="shrink-0 px-5 p-3 border-t border-zinc-800">
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
