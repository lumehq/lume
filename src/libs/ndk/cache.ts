import { NDKCacheAdapter } from '@nostr-dev-kit/ndk';
import { NDKEvent, NDKSubscription } from '@nostr-dev-kit/ndk';
import { Store } from 'tauri-plugin-store-api';

export default class TauriAdapter implements NDKCacheAdapter {
  public store: Store;
  readonly locking: boolean;

  constructor() {
    this.store = new Store('.ndk_cache.dat');
    this.locking = true;
  }

  public async query(subscription: NDKSubscription): Promise<void> {
    const { filter } = subscription;

    if (filter.authors && filter.kinds) {
      const promises = [];

      for (const author of filter.authors) {
        for (const kind of filter.kinds) {
          const key = `${author}:${kind}`;
          promises.push(this.store.get(key));
        }
      }

      const results = await Promise.all(promises);

      for (const result of results) {
        if (result) {
          const ndkEvent = new NDKEvent(subscription.ndk, JSON.parse(result as string));
          subscription.eventReceived(ndkEvent, undefined, true);
        }
      }
    }
  }

  public async setEvent(event: NDKEvent): Promise<void> {
    const nostrEvent = await event.toNostrEvent();
    if (event.kind !== 3) {
      const key = `${nostrEvent.pubkey}:${nostrEvent.kind}`;

      return new Promise((resolve) => {
        Promise.all([this.store.set(key, JSON.stringify(nostrEvent))]).then(() =>
          resolve()
        );
      });
    }
  }

  public async saveCache(): Promise<void> {
    return await this.store.save();
  }
}
