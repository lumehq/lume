import BaseLayout from '@layouts/base';

import { DatabaseContext } from '@components/contexts/database';
import { RelayContext } from '@components/contexts/relay';

import { useLocalStorage } from '@rehooks/local-storage';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getPublicKey, nip19 } from 'nostr-tools';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export default function Page() {
  const { db }: any = useContext(DatabaseContext);
  const relayPool: any = useContext(RelayContext);

  const router = useRouter();
  const { privkey }: any = router.query;

  const [relays] = useLocalStorage('relays');
  const [profile, setProfile] = useState({ picture: '', display_name: '', username: '' });

  const pubkey = useMemo(() => (privkey ? getPublicKey(privkey) : null), [privkey]);

  // save account to database
  const insertAccount = useCallback(
    async (metadata) => {
      const npub = privkey ? nip19.npubEncode(pubkey) : null;
      const nsec = privkey ? nip19.nsecEncode(privkey) : null;
      // insert to database
      await db.execute(
        `INSERT OR IGNORE INTO accounts (id, privkey, npub, nsec, metadata) VALUES ("${pubkey}", "${privkey}", "${npub}", "${nsec}", '${metadata}')`
      );
      // update state
      setProfile(JSON.parse(metadata));
    },
    [db, privkey, pubkey]
  );

  // save follows to database
  const insertFollows = useCallback(
    async (follows) => {
      follows.forEach(async (item) => {
        if (item) {
          // insert to database
          await db.execute(
            `INSERT OR IGNORE INTO follows (pubkey, account, kind) VALUES ("${item[1]}", "${pubkey}", "0")`
          );
        }
      });
    },
    [db, pubkey]
  );

  useEffect(() => {
    relayPool.subscribe(
      [
        {
          authors: [pubkey],
          kinds: [0, 3],
          since: 0,
        },
      ],
      relays,
      (event: any) => {
        if (event.kind === 0) {
          insertAccount(event.content);
        } else {
          if (event.tags.length > 0) {
            insertFollows(event.tags);
          }
        }
      },
      undefined,
      (events: any, relayURL: any) => {
        console.log(events, relayURL);
      }
    );
  }, [insertAccount, insertFollows, pubkey, relayPool, relays]);

  return (
    <div className="grid h-full w-full grid-rows-5">
      <div className="row-span-1 flex items-center justify-center">
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-3xl font-medium text-transparent">
            Bringing back your profile...
          </h1>
        </div>
      </div>
      <div className="row-span-4 flex flex-col gap-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-4 flex flex-col gap-2">
            <div className="w-full rounded-lg bg-zinc-900 p-4 shadow-input ring-1 ring-zinc-800">
              <div className="flex space-x-4">
                <div className="relative h-10 w-10 rounded-full">
                  <Image className="inline-block rounded-full" src={profile.picture} alt="" fill={true} />
                </div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{profile.display_name}</p>
                    <span className="leading-tight text-zinc-500">·</span>
                    <p className="text-zinc-500">@{profile.username}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 h-2 rounded bg-zinc-700"></div>
                      <div className="col-span-1 h-2 rounded bg-zinc-700"></div>
                    </div>
                    <div className="h-2 rounded bg-zinc-700"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex w-full transform items-center justify-center rounded-lg bg-gradient-to-r from-fuchsia-300 via-orange-100 to-amber-300 px-3.5 py-2.5 font-medium text-zinc-800 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span className="drop-shadow-lg">Done →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(
  page:
    | string
    | number
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactFragment
    | ReactPortal
) {
  return <BaseLayout>{page}</BaseLayout>;
};
