import { HeartBeatIcon } from "@shared/icons";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { READONLY_RELAYS } from "@stores/constants";
import { dateToUnix } from "@utils/date";
import { createChat, createNote, updateAccount } from "@utils/storage";
import { getParentID, nip02ToArray } from "@utils/transform";
import { useContext } from "react";
import useSWRSubscription from "swr/subscription";

export function EventCollector() {
	const pool: any = useContext(RelayContext);
	const account = useActiveAccount((state: any) => state.account);

	useSWRSubscription(account ? "eventCollector" : null, () => {
		const follows = JSON.parse(account.follows);
		const unsubscribe = pool.subscribe(
			[
				{
					kinds: [1, 6],
					authors: follows,
					since: dateToUnix(),
				},
				{
					kinds: [3],
					authors: [account.pubkey],
				},
				{
					kinds: [4],
					"#p": [account.pubkey],
					since: dateToUnix(),
				},
				{
					kinds: [4],
					authors: [account.pubkey],
					since: dateToUnix(),
				},
			],
			READONLY_RELAYS,
			(event: any) => {
				switch (event.kind) {
					// short text note
					case 1: {
						const parentID = getParentID(event.tags, event.id);
						createNote(
							event.id,
							account.id,
							event.pubkey,
							event.kind,
							event.tags,
							event.content,
							event.created_at,
							parentID,
						);
						break;
					}
					// contacts
					case 3: {
						const follows = nip02ToArray(event.tags);
						// update account's folllows with NIP-02 tag list
						updateAccount("follows", follows, event.pubkey);
						break;
					}
					// chat
					case 4: {
						if (event.pubkey === account.pubkey) {
							const receiver = event.tags.find((t) => t[0] === "p")[1];
							createChat(
								event.id,
								receiver,
								event.pubkey,
								event.content,
								event.tags,
								event.created_at,
							);
						} else {
							createChat(
								event.id,
								account.pubkey,
								event.pubkey,
								event.content,
								event.tags,
								event.created_at,
							);
						}
						break;
					}
					// repost
					case 6:
						createNote(
							event.id,
							account.id,
							event.pubkey,
							event.kind,
							event.tags,
							event.content,
							event.created_at,
							event.id,
						);
						break;
					default:
						break;
				}
			},
		);

		return () => {
			unsubscribe();
		};
	});

	return (
		<div className="inline-flex h-6 w-6 items-center justify-center rounded text-zinc-500 hover:bg-zinc-900 hover:text-green-500">
			<HeartBeatIcon width={16} height={16} />
		</div>
	);
}
