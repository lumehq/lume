import {
  NDKEvent,
  NDKFilter,
  NDKKind,
  NDKPrivateKeySigner,
  NDKSubscription,
  NDKUser,
} from '@nostr-dev-kit/ndk';
import { message, open } from '@tauri-apps/api/dialog';
import { Body, fetch } from '@tauri-apps/api/http';
import { LRUCache } from 'lru-cache';
import { NostrEventExt } from 'nostr-fetch';
import { nip19 } from 'nostr-tools';
import { useMemo } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { useStronghold } from '@stores/stronghold';

import { createBlobFromFile } from '@utils/createBlobFromFile';
import { nHoursAgo } from '@utils/date';
import { getMultipleRandom } from '@utils/transform';
import { NDKEventWithReplies, NostrBuildResponse } from '@utils/types';

export function useNostr() {
  const { db } = useStorage();
  const { ndk, relayUrls, fetcher } = useNDK();

  const privkey = useStronghold((state) => state.privkey);
  const subManager = useMemo(
    () =>
      new LRUCache<string, NDKSubscription, void>({
        max: 4,
        dispose: (sub) => sub.stop(),
      }),
    []
  );

  const sub = async (
    filter: NDKFilter,
    callback: (event: NDKEvent) => void,
    groupable?: boolean
  ) => {
    if (!ndk) throw new Error('NDK instance not found');

    const subEvent = ndk.subscribe(filter, {
      closeOnEose: false,
      groupable: groupable ?? true,
    });

    subEvent.addListener('event', (event: NDKEvent) => {
      callback(event);
    });

    subManager.set(JSON.stringify(filter), subEvent);
    console.log('current active sub: ', subManager.size);
  };

  const fetchUserData = async (preFollows?: string[]) => {
    try {
      const follows = new Set<string>(preFollows || []);
      const lruNetwork = new LRUCache<string, string, void>({ max: 300 });

      // fetch user's relays
      const relayEvents = await ndk.fetchEvents({
        kinds: [NDKKind.RelayList],
        authors: [db.account.pubkey],
      });

      if (relayEvents) {
        const latestRelayEvent = [...relayEvents].sort(
          (a, b) => b.created_at - a.created_at
        )[0];

        if (latestRelayEvent) {
          for (const item of latestRelayEvent.tags) {
            await db.createRelay(item[1], item[2]);
          }
        }
      }

      // fetch user's follows
      if (!preFollows) {
        const user = ndk.getUser({ hexpubkey: db.account.pubkey });
        const list = await user.follows();
        list.forEach((item: NDKUser) => {
          follows.add(nip19.decode(item.npub).data as string);
        });
      }

      // build user's network
      const followEvents = await ndk.fetchEvents({
        kinds: [NDKKind.Contacts],
        authors: [...follows],
        limit: 300,
      });

      followEvents.forEach((event: NDKEvent) => {
        event.tags.forEach((tag) => {
          if (tag[0] === 'p') lruNetwork.set(tag[1], tag[1]);
        });
      });

      // get lru values
      const network = [...lruNetwork.values()] as string[];

      // update db
      await db.updateAccount('follows', [...follows]);
      await db.updateAccount('network', [...new Set([...follows, ...network])]);

      // clear lru caches
      lruNetwork.clear();

      return { status: 'ok', message: 'User data fetched' };
    } catch (e) {
      return { status: 'failed', message: e };
    }
  };

  const addContact = async (pubkey: string) => {
    const list = new Set(db.account.follows);
    list.add(pubkey);

    const tags = [];
    list.forEach((item) => {
      tags.push(['p', item]);
    });

    // publish event
    publish({ content: '', kind: NDKKind.Contacts, tags: tags });
  };

  const removeContact = async (pubkey: string) => {
    const list = new Set(db.account.follows);
    list.delete(pubkey);

    const tags = [];
    list.forEach((item) => {
      tags.push(['p', item]);
    });

    // publish event
    publish({ content: '', kind: NDKKind.Contacts, tags: tags });
  };

  const fetchActivities = async () => {
    try {
      const events = await fetcher.fetchAllEvents(
        relayUrls,
        {
          kinds: [
            NDKKind.Text,
            NDKKind.Contacts,
            NDKKind.Repost,
            NDKKind.Reaction,
            NDKKind.Zap,
          ],
          '#p': [db.account.pubkey],
        },
        { since: nHoursAgo(24) },
        { sort: true }
      );

      return events as unknown as NDKEvent[];
    } catch (e) {
      console.error('Error fetching activities', e);
    }
  };

  const fetchNIP04Chats = async () => {
    const events = await fetcher.fetchAllEvents(
      relayUrls,
      {
        kinds: [NDKKind.EncryptedDirectMessage],
        '#p': [db.account.pubkey],
      },
      { since: 0 }
    );

    const senders = events.map((e) => e.pubkey);
    const follows = new Set(senders.filter((el) => db.account.follows.includes(el)));
    const unknowns = new Set(senders.filter((el) => !db.account.follows.includes(el)));

    return { follows: [...follows], unknowns: [...unknowns] };
  };

  const fetchNIP04Messages = async (sender: string) => {
    let senderMessages: NostrEventExt<false>[] = [];

    if (sender !== db.account.pubkey) {
      senderMessages = await fetcher.fetchAllEvents(
        relayUrls,
        {
          kinds: [NDKKind.EncryptedDirectMessage],
          authors: [sender],
          '#p': [db.account.pubkey],
        },
        { since: 0 }
      );
    }

    const userMessages = await fetcher.fetchAllEvents(
      relayUrls,
      {
        kinds: [NDKKind.EncryptedDirectMessage],
        authors: [db.account.pubkey],
        '#p': [sender],
      },
      { since: 0 }
    );

    const all = [...senderMessages, ...userMessages].sort(
      (a, b) => a.created_at - b.created_at
    );

    return all as unknown as NDKEvent[];
  };

  const fetchAllReplies = async (id: string, data?: NDKEventWithReplies[]) => {
    let events = data || null;

    if (!data) {
      events = (await fetcher.fetchAllEvents(
        relayUrls,
        {
          kinds: [NDKKind.Text],
          '#e': [id],
        },
        { since: 0 },
        { sort: true }
      )) as unknown as NDKEventWithReplies[];
    }

    if (events.length > 0) {
      const replies = new Set();
      events.forEach((event) => {
        const tags = event.tags.filter((el) => el[0] === 'e' && el[1] !== id);
        if (tags.length > 0) {
          tags.forEach((tag) => {
            const rootIndex = events.findIndex((el) => el.id === tag[1]);
            if (rootIndex !== -1) {
              const rootEvent = events[rootIndex];
              if (rootEvent && rootEvent.replies) {
                rootEvent.replies.push(event);
              } else {
                rootEvent.replies = [event];
              }
              replies.add(event.id);
            }
          });
        }
      });
      const cleanEvents = events.filter((ev) => !replies.has(ev.id));
      return cleanEvents;
    }

    return events;
  };

  const getAllEventsSinceLastLogin = async (customSince?: number) => {
    try {
      let since: number;
      const dbEventsEmpty = await db.isEventsEmpty();

      if (!customSince) {
        if (dbEventsEmpty || db.account.last_login_at === 0) {
          since = db.account.network.length > 400 ? nHoursAgo(12) : nHoursAgo(24);
        } else {
          since = db.account.last_login_at;
        }
      } else {
        since = customSince;
      }

      const events = (await fetcher.fetchAllEvents(
        relayUrls,
        {
          kinds: [NDKKind.Text, NDKKind.Repost, 1063, NDKKind.Article],
          authors: db.account.network,
        },
        { since: since }
      )) as unknown as NDKEvent[];

      return { status: 'ok', message: 'fetch completed', data: events };
    } catch (e) {
      console.error('prefetch events failed, error: ', e);
      return { status: 'failed', message: e };
    }
  };

  const getContactsByPubkey = async (pubkey: string) => {
    const user = ndk.getUser({ hexpubkey: pubkey });
    const follows = [...(await user.follows())].map((user) => user.hexpubkey);
    return getMultipleRandom([...follows], 10);
  };

  const getEventsByPubkey = async (pubkey: string) => {
    const events = await fetcher.fetchAllEvents(
      relayUrls,
      { authors: [pubkey], kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Article] },
      { since: nHoursAgo(24) },
      { sort: true }
    );
    return events as unknown as NDKEvent[];
  };

  const publish = async ({
    content,
    kind,
    tags,
  }: {
    content: string;
    kind: NDKKind | number;
    tags: string[][];
  }): Promise<NDKEvent> => {
    if (!privkey) throw new Error('Private key not found');

    const event = new NDKEvent(ndk);
    const signer = new NDKPrivateKeySigner(privkey);

    event.content = content;
    event.kind = kind;
    event.created_at = Math.floor(Date.now() / 1000);
    event.pubkey = db.account.pubkey;
    event.tags = tags;

    await event.sign(signer);
    await event.publish();

    return event;
  };

  const createZap = async (event: NDKEvent, amount: number, message?: string) => {
    if (!privkey) throw new Error('Private key not found');

    if (!ndk.signer) {
      const signer = new NDKPrivateKeySigner(privkey);
      ndk.signer = signer;
    }

    // @ts-expect-error, NostrEvent to NDKEvent
    const ndkEvent = new NDKEvent(ndk, event);
    const res = await ndkEvent.zap(amount, message ?? 'zap from lume');

    return res;
  };

  const upload = async (file: null | string, nip94?: boolean) => {
    try {
      let filepath = file;

      if (!file) {
        const selected = await open({
          multiple: false,
          filters: [
            {
              name: 'Media',
              extensions: [
                'png',
                'jpeg',
                'jpg',
                'gif',
                'mp4',
                'mp3',
                'webm',
                'mkv',
                'avi',
                'mov',
              ],
            },
          ],
        });
        if (Array.isArray(selected)) {
          // user selected multiple files
        } else if (selected === null) {
          return {
            url: null,
            error: 'Cancelled',
          };
        } else {
          filepath = selected;
        }
      }

      const filename = filepath.split('/').pop();
      const filetype = filename.split('.').pop();

      const fileData = await createBlobFromFile(filepath);
      const res: NostrBuildResponse = await fetch(
        'https://nostr.build/api/v2/upload/files',
        {
          method: 'POST',
          timeout: 30,
          headers: { 'Content-Type': 'multipart/form-data' },
          body: Body.form({
            fileData: {
              file: fileData,
              mime: `image/${filetype}`,
              fileName: filename,
            },
          }),
        }
      );

      if (res.ok) {
        const data = res.data.data[0];
        const url = data.url;

        if (nip94) {
          const tags = [
            ['url', url],
            ['x', data.sha256 ?? ''],
            ['m', data.mime ?? 'application/octet-stream'],
            ['size', data.size.toString() ?? '0'],
            ['dim', `${data.dimensions.width}x${data.dimensions.height}` ?? '0'],
            ['blurhash', data.blurhash ?? ''],
          ];

          await publish({ content: '', kind: 1063, tags: tags });
        }

        return {
          url: url,
          error: null,
        };
      }

      return {
        url: null,
        error: 'Upload failed',
      };
    } catch (e) {
      await message(e, { title: 'Lume', type: 'error' });
    }
  };

  return {
    sub,
    fetchUserData,
    addContact,
    removeContact,
    getAllEventsSinceLastLogin,
    fetchActivities,
    fetchNIP04Chats,
    fetchNIP04Messages,
    fetchAllReplies,
    publish,
    createZap,
    upload,
    getContactsByPubkey,
    getEventsByPubkey,
  };
}
