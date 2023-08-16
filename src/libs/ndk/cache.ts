import { NDKCacheAdapter } from '@nostr-dev-kit/ndk';
import { NDKEvent, NDKSubscription } from '@nostr-dev-kit/ndk';

import { LumeStorage } from '@libs/storage/instance';

export default class TauriAdapter implements NDKCacheAdapter {
  public store: LumeStorage;
  readonly locking: boolean;

  constructor(db: LumeStorage) {
    this.store = db;
    this.locking = true;
  }

  public async query(subscription: NDKSubscription): Promise<void> {
    const { filter } = subscription;

    if (filter.authors && filter.kinds) {
      const promises = [];

      for (const author of filter.authors) {
        for (const kind of filter.kinds) {
          const key = `${author}:${kind}`;
          promises.concat(this.store.getALlEventByKey(key));
        }
      }

      const results = await Promise.all(promises);

      for (const result of results) {
        if (result && result.event) {
          console.log('cache hit: ', result.event);
          const ndkEvent = new NDKEvent(
            subscription.ndk,
            JSON.parse(result.event as string)
          );
          subscription.eventReceived(ndkEvent, undefined, true);
        }
      }
    }

    if (filter.ids) {
      for (const id of filter.ids) {
        const cacheEvent = await this.store.getEventByID(id);

        if (cacheEvent) {
          console.log('cache hit: ', id);
          const ndkEvent = new NDKEvent(
            subscription.ndk,
            JSON.parse(cacheEvent.event as string)
          );
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
        this.store.createEvent(key, event.id, event.kind, JSON.stringify(nostrEvent)),
      ]).then(() => resolve());
    });
  }
}
