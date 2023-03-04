import BaseLayout from '@layouts/baseLayout';
import OnboardingLayout from '@layouts/onboardingLayout';

import { DatabaseContext } from '@components/contexts/database';
import { RelayContext } from '@components/contexts/relay';

import { useLocalStorage } from '@rehooks/local-storage';
import { motion } from 'framer-motion';
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
  useMemo,
  useState,
} from 'react';

export default function Page() {
  const { db }: any = useContext(DatabaseContext);
  const relayPool: any = useContext(RelayContext);

  const [loading, setLoading] = useState(false);
  const [relays] = useLocalStorage('relays');

  const router = useRouter();
  const { privkey }: any = router.query;

  const pubkey = useMemo(() => (privkey ? getPublicKey(privkey) : null), [privkey]);

  // save account to database
  const insertAccount = useCallback(
    async (metadata) => {
      if (loading === false) {
        const npub = privkey ? nip19.npubEncode(pubkey) : null;
        const nsec = privkey ? nip19.nsecEncode(privkey) : null;
        await db.execute(
          `INSERT OR IGNORE INTO accounts (id, privkey, npub, nsec, metadata) VALUES ("${pubkey}", "${privkey}", "${npub}", "${nsec}", '${metadata}')`
        );
        setLoading(true);
      }
    },
    [db, privkey, pubkey, loading]
  );

  // save follows to database
  const insertFollows = useCallback(
    async (follows) => {
      follows.forEach(async (item) => {
        if (item) {
          await db.execute(
            `INSERT OR IGNORE INTO follows (pubkey, account, kind) VALUES ("${item[1]}", "${pubkey}", "0")`
          );
        }
      });
    },
    [db, pubkey]
  );

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

  return (
    <div className="flex h-full flex-col justify-between px-8">
      <div>{/* spacer */}</div>
      <motion.div layoutId="form">
        <div className="mb-8 flex flex-col gap-3">
          <motion.h1
            layoutId="title"
            className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-3xl font-medium text-transparent"
          >
            Fetching your profile...
          </motion.h1>
          <motion.h2 layoutId="subtitle" className="w-3/4 text-zinc-400">
            As long as you have private key, you alway can sync your profile and follows list on every nostr client, so
            please keep your key safely
          </motion.h2>
        </div>
      </motion.div>
      <motion.div layoutId="action" className="pb-5">
        <div className="flex h-10 items-center">
          {loading === true ? (
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <Link
              href="/"
              className="transform rounded-lg bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 px-3.5 py-2 font-medium active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <span className="drop-shadow-lg">Finish</span>
            </Link>
          )}
        </div>
      </motion.div>
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
  return (
    <BaseLayout>
      <OnboardingLayout>{page}</OnboardingLayout>
    </BaseLayout>
  );
};
