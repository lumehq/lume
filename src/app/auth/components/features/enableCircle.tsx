import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { LRUCache } from 'lru-cache';
import { useState } from 'react';
import { toast } from 'sonner';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { CheckCircleIcon, LoaderIcon } from '@shared/icons';

import { useOnboarding } from '@stores/onboarding';

export function Circle() {
  const { db } = useStorage();
  const { ndk } = useNDK();

  const [circle, setCircle] = useOnboarding((state) => [
    state.circle,
    state.toggleCircle,
  ]);
  const [loading, setLoading] = useState(false);

  const enableLinks = async () => {
    setLoading(true);

    const users = ndk.getUser({ pubkey: db.account.pubkey });
    const follows = await users.follows();

    if (follows.size === 0) {
      setLoading(false);
      return toast('You need to follow at least 1 account');
    }

    const lru = new LRUCache<string, string, void>({ max: 300 });
    const followsAsArr = [];

    // add user's follows to lru
    follows.forEach((user) => {
      lru.set(user.pubkey, user.pubkey);
      followsAsArr.push(user.pubkey);
    });

    // get follows from follows
    const events = await ndk.fetchEvents({
      kinds: [NDKKind.Contacts],
      authors: followsAsArr,
      limit: 300,
    });

    events.forEach((event: NDKEvent) => {
      event.tags.forEach((tag) => {
        if (tag[0] === 'p') lru.set(tag[1], tag[1]);
      });
    });

    // get lru values
    const circleList = [...lru.values()] as string[];

    // update db
    await db.updateAccount('follows', JSON.stringify(followsAsArr));
    await db.updateAccount('circles', JSON.stringify(circleList));

    db.account.follows = followsAsArr;
    db.account.circles = circleList;

    // clear lru
    lru.clear();

    // done
    await db.createSetting('circles', '1');
    setCircle();
  };

  return (
    <div className="rounded-xl bg-neutral-100 p-3 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h5 className="font-semibold">Enable Circle</h5>
          <p className="text-sm">
            Beside newsfeed from your follows, you will see more content from all people
            that followed by your follows.
          </p>
        </div>
        {circle ? (
          <div className="mt-1 inline-flex h-9 w-24 shrink-0 items-center justify-center rounded-lg bg-teal-500 text-white">
            <CheckCircleIcon className="h-4 w-4" />
          </div>
        ) : (
          <button
            type="button"
            onClick={enableLinks}
            className="mt-1 inline-flex h-9 w-24 shrink-0 items-center justify-center rounded-lg bg-neutral-200 font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
          >
            {loading ? <LoaderIcon className="h-4 w-4 animate-spin" /> : 'Enable'}
          </button>
        )}
      </div>
    </div>
  );
}
