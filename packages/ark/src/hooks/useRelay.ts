import { NDKKind, NDKRelayUrl, NDKTag } from "@nostr-dev-kit/ndk";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useArk, useStorage } from "../provider";

export function useRelay() {
	const ark = useArk();
	const storage = useStorage();
	const queryClient = useQueryClient();

	const connectRelay = useMutation({
		mutationFn: async (
			relay: NDKRelayUrl,
			purpose?: "read" | "write" | undefined,
		) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({
				queryKey: ["relays", storage.account.pubkey],
			});

			// Snapshot the previous value
			const prevRelays: NDKTag[] = queryClient.getQueryData([
				"relays",
				storage.account.pubkey,
			]);

			// create new relay list if not exist
			if (!prevRelays) {
				await ark.createEvent({
					kind: NDKKind.RelayList,
					tags: [["r", relay, purpose ?? ""]],
				});
			}

			// add relay to exist list
			const index = prevRelays.findIndex((el) => el[1] === relay);
			if (index > -1) return;

			await ark.createEvent({
				kind: NDKKind.RelayList,
				tags: [...prevRelays, ["r", relay, purpose ?? ""]],
			});

			// Optimistically update to the new value
			queryClient.setQueryData(
				["relays", storage.account.pubkey],
				(prev: NDKTag[]) => [...prev, ["r", relay, purpose ?? ""]],
			);

			// Return a context object with the snapshotted value
			return { prevRelays };
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["relays", storage.account.pubkey],
			});
		},
	});

	const removeRelay = useMutation({
		mutationFn: async (relay: NDKRelayUrl) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({
				queryKey: ["relays", storage.account.pubkey],
			});

			// Snapshot the previous value
			const prevRelays: NDKTag[] = queryClient.getQueryData([
				"relays",
				storage.account.pubkey,
			]);

			if (!prevRelays) return;

			const index = prevRelays.findIndex((el) => el[1] === relay);
			if (index > -1) prevRelays.splice(index, 1);

			await ark.createEvent({
				kind: NDKKind.RelayList,
				tags: prevRelays,
			});

			// Optimistically update to the new value
			queryClient.setQueryData(["relays", storage.account.pubkey], prevRelays);

			// Return a context object with the snapshotted value
			return { prevRelays };
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["relays", storage.account.pubkey],
			});
		},
	});

	return { connectRelay, removeRelay };
}
