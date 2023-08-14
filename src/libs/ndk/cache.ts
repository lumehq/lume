import { NDKCacheAdapter } from '@nostr-dev-kit/ndk';
import { NDKEvent, NDKSubscription } from '@nostr-dev-kit/ndk';
import { Store } from '@tauri-apps/plugin-store';

export default class TauriAdapter implements NDKCacheAdapter {
  public store: Store;
  readonly locking: boolean;

  constructor() {
    this.store = new Store('.ndkcache.dat');
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
          const event = await this.store.get(result as string);

          if (event) {
            console.log('cache hit: ', result);
            const ndkEvent = new NDKEvent(subscription.ndk, JSON.parse(event as string));
            subscription.eventReceived(ndkEvent, undefined, true);
          }
        }
      }
    }

    if (filter.ids) {
      for (const id of filter.ids) {
        const key = id;
        const event = await this.store.get(key);

        if (event) {
          console.log('cache hit: ', id);
          const ndkEvent = new NDKEvent(subscription.ndk, JSON.parse(event as string));
          subscription.eventReceived(ndkEvent, undefined, true);
        }
      }
    }
  }

  public async setEvent(event: NDKEvent): Promise<void> {
    const nostrEvent = await event.toNostrEvent();
    const key = `${nostrEvent.pubkey}:${nostrEvent.kind}`;

    return new Promise((resolve) => {
      Promise.all([
        this.store.set(event.id, JSON.stringify(nostrEvent)),
        this.store.set(key, event.id),
      ]).then(() => resolve());
    });
  }

  public save() {
    return this.store.save();
  }
}
