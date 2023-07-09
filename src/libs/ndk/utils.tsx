import NDK, { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';

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
