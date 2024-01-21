import { useRelaylist } from "@lume/ark";
import { PlusIcon } from "@lume/icons";
import { normalizeRelayUrl } from "nostr-fetch";
import { useState } from "react";
import { toast } from "sonner";

export function RelayForm() {
	const { connectRelay } = useRelaylist();

	const [relay, setRelay] = useState<{
		url: WebSocket["url"];
		purpose: "read" | "write" | undefined;
	}>({ url: "", purpose: undefined });

	const create = () => {
		if (relay.url.length < 1) return toast.info("Please enter relay url");
		try {
			const relayUrl = new URL(relay.url.replace(/\s/g, ""));

			if (relayUrl.protocol === "wss:" || relayUrl.protocol === "ws:") {
				connectRelay.mutate(normalizeRelayUrl(relay.url));
				setRelay({ url: "", purpose: undefined });
			} else {
				return toast.error(
					"URL is invalid, a relay must use websocket protocol (start with wss:// or ws://). Please check again",
				);
			}
		} catch {
			return toast.error("Relay URL is not valid. Please check again");
		}
	};

	return (
		<div className="flex gap-2">
			<input
				className="h-11 w-full rounded-lg border-transparent px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white/50 dark:bg-black/50 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
				placeholder="wss://"
				spellCheck={false}
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
				value={relay.url}
				onChange={(e) => setRelay((prev) => ({ ...prev, url: e.target.value }))}
			/>
			<button
				type="button"
				onClick={() => create()}
				className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600"
			>
				<PlusIcon className="size-5" />
			</button>
		</div>
	);
}
