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

export async function initNDK(relays?: string[]): Promise<NDK> {
	const opts: NDKConstructorParams = {};
	const defaultRelays = new Set(relays || FULL_RELAYS);

	opts.explicitRelayUrls = [...defaultRelays];

	const ndk = new NDK(opts);
	await ndk.connect(500);

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
			setTimeout(() => resolve(new Set(events.values())), 1200);
		});
	});
}

export function usePublish() {
	const ndk = useContext(RelayContext);
	const { account } = useAccount();

	const publish = async ({
		content,
		kind,
		tags,
	}: {
		content: string;
		kind: NDKKind;
		tags: string[][];
	}): Promise<NDKEvent> => {
		const event = new NDKEvent(ndk);
		const signer = new NDKPrivateKeySigner(account.privkey);

		event.content = content;
		event.kind = kind;
		event.created_at = Math.floor(Date.now() / 1000);
		event.pubkey = account.pubkey;
		event.tags = tags;

		await event.sign(signer);
		await event.publish();

		return event;
	};

	return publish;
}
