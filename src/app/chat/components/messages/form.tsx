import { RelayContext } from "@shared/relayProvider";
import { useChatMessages } from "@stores/chats";
import { WRITEONLY_RELAYS } from "@stores/constants";
import { dateToUnix } from "@utils/date";
import { getEventHash, getSignature, nip04 } from "nostr-tools";
import { useCallback, useContext, useState } from "react";

export function ChatMessageForm({
	receiverPubkey,
	userPubkey,
	userPrivkey,
}: { receiverPubkey: string; userPubkey: string; userPrivkey: string }) {
	const pool: any = useContext(RelayContext);
	const addMessage = useChatMessages((state: any) => state.add);
	const [value, setValue] = useState("");

	const encryptMessage = useCallback(async () => {
		return await nip04.encrypt(userPrivkey, receiverPubkey, value);
	}, [receiverPubkey, value]);

	const submit = async () => {
		const message = await encryptMessage();

		const event: any = {
			content: message,
			created_at: dateToUnix(),
			kind: 4,
			pubkey: userPubkey,
			tags: [["p", receiverPubkey]],
		};

		event.id = getEventHash(event);
		event.sig = getSignature(event, userPrivkey);

		// publish message
		pool.publish(event, WRITEONLY_RELAYS);

		// add message to store
		addMessage({
			receiver_pubkey: receiverPubkey,
			sender_pubkey: event.pubkey,
			content: event.content,
			tags: event.tags,
			created_at: event.created_at,
		});

		// reset state
		setValue("");
	};

	const handleEnterPress = (e: {
		key: string;
		shiftKey: any;
		preventDefault: () => void;
	}) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	};

	return (
		<div className="relative h-11 w-full overflow-hidden">
			<input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleEnterPress}
				spellCheck={false}
				placeholder="Message"
				className="relative h-11 w-full resize-none rounded-md px-5 !outline-none bg-zinc-800 placeholder:text-zinc-500"
			/>
		</div>
	);
}
