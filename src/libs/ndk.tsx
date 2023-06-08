import NDK, { NDKConstructorParams } from "@nostr-dev-kit/ndk";
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
