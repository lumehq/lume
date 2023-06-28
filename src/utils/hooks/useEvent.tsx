import { createNote, getNoteByID } from "@libs/storage";
import { RelayContext } from "@shared/relayProvider";
import { useQuery } from "@tanstack/react-query";
import { parser } from "@utils/parser";
import { useContext } from "react";

export function useEvent(id: string) {
	const ndk = useContext(RelayContext);
	const { status, data, error, isFetching } = useQuery(
		["note", id],
		async () => {
			const result = await getNoteByID(id);
			if (result) {
				if (result.kind === 1 || result.kind === 1063) {
					result["content"] = parser(result);
				}
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
				if (event.kind === 1 || event.kind === 1063) {
					// @ts-ignore
					event["content"] = parser(event);
				}
				return event;
			}
		},
		{
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
		},
	);

	return { status, data, error, isFetching };
}
