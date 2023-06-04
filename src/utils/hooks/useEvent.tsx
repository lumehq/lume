import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { READONLY_RELAYS } from "@stores/constants";
import { createNote, getNoteByID } from "@utils/storage";
import { getParentID } from "@utils/transform";
import { useContext } from "react";
import useSWR from "swr";
import useSWRSubscription from "swr/subscription";

const fetcher = ([, id]) => getNoteByID(id);

export function useEvent(id: string) {
	const pool: any = useContext(RelayContext);
	const account = useActiveAccount((state: any) => state.account);

	const { data: cache } = useSWR(["event", id], fetcher);
	const { data: newest } = useSWRSubscription(
		!cache ? id : null,
		(key, { next }) => {
			const unsubscribe = pool.subscribe(
				[
					{
						ids: [key],
					},
				],
				READONLY_RELAYS,
				(event: any) => {
					const parentID = getParentID(event.tags, event.id);
					// insert event to local database
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
					// update state
					next(null, event);
				},
				undefined,
				undefined,
				{
					unsubscribeOnEose: true,
				},
			);

			return () => {
				unsubscribe();
			};
		},
	);

	return cache ? cache : newest;
}
