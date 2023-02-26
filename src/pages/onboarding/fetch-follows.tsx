/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import OnboardingLayout from '@layouts/onboardingLayout';

import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useNostrEvents } from 'nostr-react';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

export default function Page() {
  const [follows, setFollows] = useState([null]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { pubkey }: any = router.query;

  const { onEvent } = useNostrEvents({
    filter: {
      authors: [pubkey],
      kinds: [3],
    },
  });

  onEvent((rawMetadata) => {
    try {
      setFollows(rawMetadata.tags);
    } catch (err) {
      console.error(err, rawMetadata);
    }
  });

  useEffect(() => {
    setLoading(true);

    const insertDB = async () => {
      const db = await Database.load('sqlite:lume.db');
      follows.forEach(async (item) => {
        if (item) {
          await db.execute(`INSERT OR IGNORE INTO follows (pubkey, account) VALUES ("${item[1]}", "${pubkey}")`);
        }
      });
    };

    if (follows !== null && follows.length > 0) {
      insertDB()
        .then(() => {
          setTimeout(() => {
            setLoading(false);
            router.push('/');
          }, 1500);
        })
        .catch(console.error);
    }
  }, [follows, pubkey, router]);

  return (
    <div className="flex h-full flex-col justify-between px-8">
      <div>{/* spacer */}</div>
      <motion.div layoutId="form">
        <div className="mb-8 flex flex-col gap-3">
          <motion.h1 layoutId="title" className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-3xl font-medium text-transparent">
            Fetching your follows...
          </motion.h1>
          <motion.h2 layoutId="subtitle" className="w-3/4 text-zinc-400">
            Not only profile, every nostr client can sync your follows list when you move to a new client, so please keep your key safely (again)
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
