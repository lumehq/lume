import ChatMessageForm from "@app/chat/components/messages/form";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { chatMessagesAtom } from "@stores/chat";
import { READONLY_RELAYS } from "@stores/constants";
import { usePageContext } from "@utils/hooks/usePageContext";
import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Suspense, lazy, useContext, useEffect } from "react";
import useSWRSubscription from "swr/subscription";

const ChatMessageList = lazy(() => import("@app/chat/components/messageList"));

export function Page() {
	const pool: any = useContext(RelayContext);
	const account = useActiveAccount((state: any) => state.account);

	const pageContext = usePageContext();
	const searchParams: any = pageContext.urlParsed.search;
	const pubkey = searchParams.pubkey;

	const setChatMessages = useSetAtom(chatMessagesAtom);
	const resetChatMessages = useResetAtom(chatMessagesAtom);

	useSWRSubscription(account ? ["chat", pubkey] : null, ([, key]) => {
		const unsubscribe = pool.subscribe(
			[
				{
					kinds: [4],
					authors: [key],
					"#p": [account.pubkey],
					limit: 20,
				},
				{
					kinds: [4],
					authors: [account.pubkey],
					"#p": [key],
					limit: 20,
				},
			],
			READONLY_RELAYS,
			(event: any) => {
				setChatMessages((prev) => [...prev, event]);
			},
		);

		return () => {
			unsubscribe();
		};
	});

	useEffect(() => {
		let ignore = false;

		if (!ignore) {
			// reset chat messages
			resetChatMessages();
		}

		return () => {
			ignore = true;
		};
	});

	return (
		<div className="relative flex h-full w-full flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
			<Suspense fallback={<p>Loading...</p>}>
				<ChatMessageList />
			</Suspense>
			<div className="shrink-0 p-3">
				<ChatMessageForm receiverPubkey={pubkey} />
			</div>
		</div>
	);
}
