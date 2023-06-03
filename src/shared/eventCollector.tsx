import { HeartBeatIcon } from "@shared/icons";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { READONLY_RELAYS } from "@stores/constants";
import { dateToUnix } from "@utils/date";
import { createNote } from "@utils/storage";
import { getParentID } from "@utils/transform";
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
