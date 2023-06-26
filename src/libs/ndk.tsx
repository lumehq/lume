import NDK, {
	NDKConstructorParams,
	NDKEvent,
	NDKFilter,
	NDKKind,
	NDKPrivateKeySigner,
} from "@nostr-dev-kit/ndk";
import { RelayContext } from "@shared/relayProvider";
import { FULL_RELAYS } from "@stores/constants";
import { useAccount } from "@utils/hooks/useAccount";
import { useContext } from "react";

export async function initNDK(
	relays?: string[],
	cache?: boolean,
): Promise<NDK> {
	const opts: NDKConstructorParams = {};
	opts.explicitRelayUrls = relays || FULL_RELAYS;

	const ndk = new NDK(opts);
	await ndk.connect();

	return ndk;
}

export async function prefetchEvents(
	ndk: NDK,
	filter: NDKFilter,
): Promise<Set<NDKEvent>> {
	return new Promise((resolve) => {
		const events: Map<string, NDKEvent> = new Map();

		const relaySetSubscription = ndk.subscribe(filter, {
			closeOnEose: true,
		});

		relaySetSubscription.on("event", (event: NDKEvent) => {
			event.ndk = ndk;
			events.set(event.tagId(), event);
		});

		relaySetSubscription.on("eose", () => {
			setTimeout(() => resolve(new Set(events.values())), 5000);
		});
	});
}

export function usePublish() {
	const { account } = useAccount();
	const ndk = useContext(RelayContext);

	if (!ndk.signer) {
		const signer = new NDKPrivateKeySigner(account?.privkey);
		ndk.signer = signer;
	}

	function publish({
		content,
		kind,
		tags,
	}: { content: string; kind: NDKKind; tags: string[][] }) {
		const event = new NDKEvent(ndk);

		event.content = content;
		event.kind = kind;
		event.created_at = Math.floor(Date.now() / 1000);
		event.pubkey = account.pubkey;
		event.tags = tags;

		event.publish();
	}

	return publish;
}
