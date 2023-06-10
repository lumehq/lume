import NDK, {
	NDKConstructorParams,
	NDKEvent,
	NDKFilter,
} from "@nostr-dev-kit/ndk";
import { FULL_RELAYS } from "@stores/constants";

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
			setTimeout(() => resolve(new Set(events.values())), 3000);
		});
	});
}
