import { useRelay } from "@lume/ark";
import { PlusIcon } from "@lume/icons";
import { NDKRelayUrl } from "@nostr-dev-kit/ndk";
import { normalizeRelayUrl } from "nostr-fetch";
import { useState } from "react";
import { toast } from "sonner";

const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;

export function RelayForm() {
	const { connectRelay } = useRelay();
	const [relay, setRelay] = useState<{
		url: NDKRelayUrl;
		purpose: "read" | "write" | undefined;
	}>({ url: "", purpose: undefined });

	const create = () => {
		if (relay.url.length < 1) return toast.info("Please enter relay url");
		try {
			const relayUrl = new URL(relay.url.replace(/\s/g, ""));
			if (
				domainRegex.test(relayUrl.host) &&
				(relayUrl.protocol === "wss:" || relayUrl.protocol === "ws:")
			) {
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
		<div className="flex flex-col gap-1">
			<div className="flex gap-2">
				<input
					className="h-11 flex-1 rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
					placeholder="wss://"
					spellCheck={false}
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					value={relay.url}
					onChange={(e) =>
						setRelay((prev) => ({ ...prev, url: e.target.value }))
					}
				/>
				<button
					type="button"
					onClick={() => create()}
					className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600"
				>
					<PlusIcon className="h-5 w-5" />
				</button>
			</div>
		</div>
	);
}
