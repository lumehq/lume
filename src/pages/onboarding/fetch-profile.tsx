/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import OnboardingLayout from '@layouts/onboardingLayout';

import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useNostrEvents } from 'nostr-react';
import { getPublicKey, nip19 } from 'nostr-tools';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useCallback, useEffect, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

export default function Page() {
  const router = useRouter();
  const { privkey }: any = router.query;

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const pubkey = privkey ? getPublicKey(privkey) : null;
  const npub = privkey ? nip19.npubEncode(pubkey) : null;
  const nsec = privkey ? nip19.nsecEncode(privkey) : null;

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

  const insertDB = useCallback(async () => {
    // save account to database
    const db = await Database.load('sqlite:lume.db');
    const metadata = JSON.stringify(account);
    await db.execute(
      `INSERT INTO accounts (id, privkey, npub, nsec, metadata) VALUES ("${pubkey}", "${privkey}", "${npub}", "${nsec}", '${metadata}')`
    );
    await db.close();
  }, [account, npub, nsec, privkey, pubkey]);

  useEffect(() => {
    setLoading(true);

    if (account !== null) {
      insertDB()
        .then(() => {
          setTimeout(() => {
            setLoading(false);
            router.push({
              pathname: '/onboarding/fetch-follows',
              query: { pubkey: pubkey },
            });
          }, 1500);
        })
        .catch(console.error);
    }
  }, [account, insertDB, npub, nsec, privkey, pubkey, router]);

  return (
    <div className="flex h-full flex-col justify-between px-8">
      <div>{/* spacer */}</div>
      <motion.div layoutId="form">
        <div className="mb-8 flex flex-col gap-3">
          <motion.h1 layoutId="title" className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-3xl font-medium text-transparent">
            Fetching your profile...
          </motion.h1>
          <motion.h2 layoutId="subtitle" className="w-3/4 text-zinc-400">
            As long as you have private key, you alway can sync your profile on every nostr client, so please keep your key safely
          </motion.h2>
        </div>
      </motion.div>
      <motion.div layoutId="action" className="pb-5">
        <div className="flex h-10 items-center">
          {loading === true ? (
            <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <></>
          )}
        </div>
      </motion.div>
    </div>
  );
}

Page.getLayout = function getLayout(
  page: string | number | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | ReactFragment | ReactPortal
) {
  return (
    <BaseLayout>
      <OnboardingLayout>{page}</OnboardingLayout>
    </BaseLayout>
  );
};
