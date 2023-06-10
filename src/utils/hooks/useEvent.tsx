import { createNote, getNoteByID } from "@libs/storage";
import { RelayContext } from "@shared/relayProvider";
import { useContext } from "react";
import useSWR from "swr";

const fetcher = async ([, ndk, id]) => {
	const result = await getNoteByID(id);

	if (result) {
		return result;
	} else {
		const event = await ndk.fetchEvent(id);
		await createNote(
			event.id,
			event.pubkey,
			event.kind,
			event.tags,
			event.content,
			event.created_at,
		);
		event["event_id"] = event.id;
		return event;
	}
};

export function useEvent(id: string) {
	const ndk = useContext(RelayContext);
	const { data } = useSWR(["note", ndk, id], fetcher);

	return data;
}
