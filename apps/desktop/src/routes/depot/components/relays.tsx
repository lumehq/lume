import { useArk, useStorage } from "@lume/ark";
import { LoaderIcon, RunIcon } from "@lume/icons";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DepotRelaysCard() {
	const ark = useArk();
	const storage = useStorage();

	const [status, setStatus] = useState(false);
	const [relaySize, setRelaySize] = useState(0);

	const backupRelays = async () => {
		try {
			setStatus(true);

			const event = await ark.getEventByFilter({
				filter: {
					authors: [storage.account.pubkey],
					kinds: [NDKKind.RelayList],
				},
			});

			// broadcast to depot
			const publish = await event.publish();

			if (publish) {
				setStatus(false);
				toast.success("Backup profile successfully.");
			}
		} catch (e) {
			setStatus(false);
			toast.error(JSON.stringify(e));
		}
	};

	useEffect(() => {
		async function loadRelays() {
			const event = await ark.getEventByFilter({
				filter: {
					authors: [storage.account.pubkey],
					kinds: [NDKKind.RelayList],
				},
			});
			if (event) setRelaySize(event.tags.length);
		}

		loadRelays();
	}, []);

	return (
		<div className="flex h-56 w-full flex-col gap-2 overflow-hidden rounded-xl bg-neutral-100 p-2 dark:bg-neutral-900">
			<div className="flex flex-1 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-800">
				<p className="text-lg font-semibold">{relaySize} relays</p>
			</div>
			<div className="inline-flex shrink-0 items-center justify-between">
				<div className="text-sm font-medium">Relay List</div>
				<button
					type="button"
					onClick={backupRelays}
					className="inline-flex h-8 w-max items-center justify-center gap-2 rounded-md bg-blue-500 pl-2 pr-3 font-medium text-white shadow shadow-blue-500/50 hover:bg-blue-600"
				>
					{status ? (
						<LoaderIcon className="size-4 animate-spin" />
					) : (
						<RunIcon className="size-4" />
					)}
					Backup
				</button>
			</div>
		</div>
	);
}
