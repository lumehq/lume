import { createNote } from "@libs/storage";
import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { RelayContext } from "@shared/relayProvider";
import { useNote } from "@stores/note";
import { useAccount } from "@utils/hooks/useAccount";
import { useContext, useEffect, useRef } from "react";

export function useNewsfeed() {
	const ndk = useContext(RelayContext);
	const sub = useRef(null);
	const now = useRef(Math.floor(Date.now() / 1000));
	const toggleHasNewNote = useNote((state) => state.toggleHasNewNote);

	const { status, account } = useAccount();

	useEffect(() => {
		if (status === "success" && account) {
			const follows = account ? JSON.parse(account.follows) : [];

			const filter: NDKFilter = {
				kinds: [1, 6],
				authors: follows,
				since: now.current,
			};

			sub.current = ndk.subscribe(filter, { closeOnEose: false });

			sub.current.addListener("event", (event: NDKEvent) => {
				console.log("new note: ", event);
				// add to db
				createNote(
					event.id,
					event.pubkey,
					event.kind,
					event.tags,
					event.content,
					event.created_at,
				);
				// notify user about created note
				toggleHasNewNote(true);
			});
		}

		return () => {
			sub.current.stop();
		};
	}, [status]);
}
