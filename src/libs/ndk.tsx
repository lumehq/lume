import NDK, {
  NDKConstructorParams,
  NDKEvent,
  NDKFilter,
  NDKKind,
  NDKPrivateKeySigner,
} from '@nostr-dev-kit/ndk';

import { useNDK } from '@libs/ndk/provider';

import { FULL_RELAYS } from '@stores/constants';

import { useAccount } from '@utils/hooks/useAccount';

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
  filter: NDKFilter
): Promise<Set<NDKEvent>> {
  return new Promise((resolve) => {
    const events: Map<string, NDKEvent> = new Map();

    const relaySetSubscription = ndk.subscribe(filter, {
      closeOnEose: true,
    });

    relaySetSubscription.on('event', (event: NDKEvent) => {
      event.ndk = ndk;
      events.set(event.tagId(), event);
    });

    relaySetSubscription.on('eose', () => {
      setTimeout(() => resolve(new Set(events.values())), 3000);
    });
  });
}
