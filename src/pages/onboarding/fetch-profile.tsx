/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import OnboardingLayout from '@layouts/onboardingLayout';

import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useNostrEvents } from 'nostr-react';
import { getPublicKey, nip19 } from 'nostr-tools';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useCallback,
  useState,
} from 'react';
import Database from 'tauri-plugin-sql-api';

export default function Page() {
  const [account, setAccount] = useState(null);

  const router = useRouter();
  const { privkey }: any = router.query;

  const pubkey = getPublicKey(privkey);
  const npub = nip19.npubEncode(pubkey);
  const nsec = nip19.nsecEncode(privkey);

  const { onEvent } = useNostrEvents({
    filter: {
      authors: [pubkey],
      kinds: [0],
    },
  });

  onEvent((rawMetadata) => {
    try {
      const metadata: any = JSON.parse(rawMetadata.content);
      setAccount(metadata);
    } catch (err) {
      console.error(err, rawMetadata);
    }
  });

  const insertAccount = useCallback(async () => {
    // save account to database
    const db = await Database.load('sqlite:lume.db');
    await db.execute(
      `INSERT INTO accounts (privkey, pubkey, npub, nsec, metadata) VALUES ("${privkey}", "${pubkey}", "${npub}", "${nsec}", '${JSON.stringify(
        account
      )}')`
    );
    await db.close();

    setTimeout(() => {
      router.push('/feed/following');
    }, 500);
  }, [account, npub, nsec, privkey, pubkey, router]);

  return (
    <div className="flex h-full flex-col justify-between px-8">
      <div>{/* spacer */}</div>
      <motion.div layoutId="form">
        <div className="mb-8 flex flex-col gap-3">
          <motion.h1
            layoutId="title"
            className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-3xl font-medium text-transparent">
            Getting your old profile
          </motion.h1>
          <motion.h2 layoutId="subtitle" className="w-3/4 text-zinc-400">
            As long as you have private key, you alway can recover your profile as well as follows
            list when you move to new nostr client
          </motion.h2>
        </div>
        <div className="flex flex-col gap-4">
          <p>#TODO: show profile</p>
        </div>
      </motion.div>
      <motion.div layoutId="action" className="pb-5">
        <div className="flex h-10 items-center">
          <div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
            <button
              onClick={() => insertAccount()}
              className="transform rounded-lg border border-white/10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 px-3.5 py-2 font-medium shadow-input shadow-black/5 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-black/10">
              <span className="drop-shadow-lg">Finish →</span>
            </button>
          </div>
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
