import { magnetDecode } from '@ctrl/magnet-link';
import {
  NDKEvent,
  NDKFilter,
  NDKKind,
  NDKPrivateKeySigner,
  NDKSubscription,
  NDKUser,
} from '@nostr-dev-kit/ndk';
import { ndkAdapter } from '@nostr-fetch/adapter-ndk';
import { message, open } from '@tauri-apps/plugin-dialog';
import { VoidApi } from '@void-cat/api';
import { LRUCache } from 'lru-cache';
import { NostrFetcher } from 'nostr-fetch';
import { nip19 } from 'nostr-tools';
import { useMemo } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { useStronghold } from '@stores/stronghold';

import { createBlobFromFile } from '@utils/createBlobFromFile';
import { nHoursAgo } from '@utils/date';
import { NDKEventWithReplies } from '@utils/types';

export function useNostr() {
  const { ndk, relayUrls } = useNDK();
  const { db } = useStorage();

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
    closeOnEose?: boolean
  ) => {
    if (!ndk) throw new Error('NDK instance not found');

    const subEvent = ndk.subscribe(filter, { closeOnEose: closeOnEose ?? true });
    subManager.set(JSON.stringify(filter), subEvent);

    subEvent.addListener('event', (event: NDKEvent) => {
      callback(event);
    });
  };

  const fetchUserData = async (preFollows?: string[]) => {
    try {
      const follows = new Set<string>(preFollows || []);
      const lruNetwork = new LRUCache<string, string, void>({ max: 300 });

      // fetch user's follows
      if (!preFollows) {
        const user = ndk.getUser({ hexpubkey: db.account.pubkey });
        const list = await user.follows();
        list.forEach((item: NDKUser) => {
          follows.add(nip19.decode(item.npub).data as string);
        });
      }

      // build user's network
      const events = await ndk.fetchEvents({
        kinds: [3],
        authors: [...follows],
        limit: 300,
      });

      events.forEach((event: NDKEvent) => {
        event.tags.forEach((tag) => {
          if (tag[0] === 'p') lruNetwork.set(tag[1], tag[1]);
        });
      });

      const network = [...lruNetwork.values()] as string[];

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

  const prefetchEvents = async () => {
    try {
      const fetcher = NostrFetcher.withCustomPool(ndkAdapter(ndk));
      const dbEventsEmpty = await db.isEventsEmpty();

      let since: number;
      if (dbEventsEmpty || db.account.last_login_at === 0) {
        since = nHoursAgo(24);
      } else {
        since = db.account.last_login_at;
      }

      console.log("prefetching events with user's network: ", db.account.network.length);
      console.log('prefetching events since: ', since);

      const events = await fetcher.fetchAllEvents(
        relayUrls,
        {
          kinds: [NDKKind.Text, NDKKind.Repost, 1063, NDKKind.Article],
          authors: db.account.network,
        },
        { since: since }
      );

      // save all events to database
      for (const event of events) {
        let root: string;
        let reply: string;
        if (event.tags?.[0]?.[0] === 'e' && !event.tags?.[0]?.[3]) {
          root = event.tags[0][1];
        } else {
          root = event.tags.find((el) => el[3] === 'root')?.[1];
          reply = event.tags.find((el) => el[3] === 'reply')?.[1];
        }
        await db.createEvent(
          event.id,
          JSON.stringify(event),
          event.pubkey,
          event.kind,
          root,
          reply,
          event.created_at
        );
      }

      return { status: 'ok', data: [], message: 'prefetch completed' };
    } catch (e) {
      console.error('prefetch events failed, error: ', e);
      return { status: 'failed', data: [], message: e };
    }
  };

  const fetchActivities = async () => {
    try {
      const fetcher = NostrFetcher.withCustomPool(ndkAdapter(ndk));
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
    const fetcher = NostrFetcher.withCustomPool(ndkAdapter(ndk));
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
    const fetcher = NostrFetcher.withCustomPool(ndkAdapter(ndk));

    const senderMessages = await fetcher.fetchAllEvents(
      relayUrls,
      {
        kinds: [NDKKind.EncryptedDirectMessage],
        authors: [sender],
        '#p': [db.account.pubkey],
      },
      { since: 0 }
    );

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
    const fetcher = NostrFetcher.withCustomPool(ndkAdapter(ndk));

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
      const voidcat = new VoidApi('https://void.cat');

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
          filepath = selected.path;
        }
      }

      const filename = filepath.split('/').pop();
      const filetype = filename.split('.').pop();

      const blob = await createBlobFromFile(filepath);
      const uploader = voidcat.getUploader(blob);

      // upload file
      const res = await uploader.upload();

      if (res.ok) {
        const url =
          res.file?.metadata?.url ?? `https://void.cat/d/${res.file?.id}.${filetype}`;

        if (nip94) {
          const tags = [
            ['url', url],
            ['x', res.file?.metadata?.digest ?? ''],
            ['m', res.file?.metadata?.mimeType ?? 'application/octet-stream'],
            ['size', res.file?.metadata?.size.toString() ?? '0'],
          ];

          if (res.file?.metadata?.magnetLink) {
            tags.push(['magnet', res.file.metadata.magnetLink]);
            const parsedMagnet = magnetDecode(res.file.metadata.magnetLink);
            if (parsedMagnet?.infoHash) {
              tags.push(['i', parsedMagnet?.infoHash]);
            }
          }

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
    prefetchEvents,
    fetchActivities,
    fetchNIP04Chats,
    fetchNIP04Messages,
    fetchAllReplies,
    publish,
    createZap,
    upload,
  };
}
