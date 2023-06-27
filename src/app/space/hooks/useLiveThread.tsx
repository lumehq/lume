import { createReplyNote } from "@libs/storage";
import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { RelayContext } from "@shared/relayProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useRef } from "react";

export function useLiveThread(id: string) {
	const ndk = useContext(RelayContext);
	const queryClient = useQueryClient();
	const now = useRef(Math.floor(Date.now() / 1000));

	const thread = useMutation({
		mutationFn: (data: NDKEvent) => {
			return createReplyNote(
				id,
				data.id,
				data.pubkey,
				data.kind,
				data.tags,
				data.content,
				data.created_at,
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["replies", id] });
		},
	});

	useEffect(() => {
		const filter: NDKFilter = {
			kinds: [1],
			"#e": [id],
			since: now.current,
		};

		const sub = ndk.subscribe(filter, { closeOnEose: false });

		sub.addListener("event", (event: NDKEvent) => {
			thread.mutate(event);
		});

		return () => {
			sub.stop();
		};
	}, []);
}
