/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import FullLayout from '@layouts/fullLayout';

import { currentUser } from '@stores/currentUser';
import { follows } from '@stores/follows';

import LumeSymbol from '@assets/icons/Lume';

import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useCallback, useEffect, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

const db = typeof window !== 'undefined' ? await Database.load('sqlite:lume.db') : null;

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const initDB = useCallback(async () => {
    if (db) {
      await db.execute(
        'CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY, privkey TEXT NOT NULL, pubkey TEXT NOT NULL, npub TEXT, nsec TEXT, current INTEGER DEFAULT "0" NOT NULL, metadata JSON, UNIQUE(privkey));'
      );
      await db.execute('CREATE TABLE IF NOT EXISTS follows (id INTEGER PRIMARY KEY, pubkey TEXT NOT NULL, account TEXT, UNIQUE(pubkey));');
      await db.execute(
        'CREATE TABLE IF NOT EXISTS note_reactions (id INTEGER PRIMARY KEY, reaction_id TEXT NOT NULL, e TEXT, p TEXT, UNIQUE(reaction_id));'
      );
      await db.execute('CREATE TABLE IF NOT EXISTS note_replies (id INTEGER PRIMARY KEY, reply_id TEXT NOT NULL, e TEXT, p TEXT, UNIQUE(reply_id));');
      await db.execute('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, event_id TEXT, event JSON, UNIQUE(event_id));');
      await db.execute('CREATE TABLE IF NOT EXISTS cache_profiles (id INTEGER PRIMARY KEY, pubkey TEXT, metadata JSON, UNIQUE(pubkey));');
      await db.execute('CREATE TABLE IF NOT EXISTS block_pubkeys (id INTEGER PRIMARY KEY, pubkey TEXT, UNIQUE(pubkey));');
      await db.close();
    }
  }, []);

  const notification = useCallback(async () => {
    // NOTE: notification don't work in dev mode (only affect MacOS)
    // ref: https://github.com/tauri-apps/tauri/issues/4965
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
      sendNotification({ title: 'Lume', body: 'Nostr is awesome' });
    }
  }, []);

  const getAccount = useCallback(async () => {
    const db = await Database.load('sqlite:lume.db');
    const result = await db.select(`SELECT * FROM accounts WHERE current = "1" ORDER BY id ASC LIMIT 1`);

    return result;
  }, []);

  const getFollows = useCallback(async (account) => {
    const arr = [];
    const db = await Database.load('sqlite:lume.db');
    const result: any = await db.select(`SELECT pubkey FROM follows WHERE account = "${account.pubkey}"`);

    result.forEach((item: { pubkey: string }) => {
      arr.push(item.pubkey);
    });

    return arr;
  }, []);

  // Explain:
  // Step 1: check DB tables, if not exist then create new table. #TODO: move this function to Rust code
  // Step 2: request allow notification from system
  // Step 3: get first account. #TODO: get last used account instead (part of multi account feature)
  // Step 4: get follows by account
  useEffect(() => {
    initDB()
      .then(() => notification())
      .then(() => {
        getAccount()
          .then((res: any) => {
            if (res.length === 0) {
              setTimeout(() => {
                setLoading(false);
                router.push('/onboarding');
              }, 1500);
            } else {
              // store current user in localstorage
              currentUser.set(res[0]);
              getFollows(res[0])
                .then(async (res) => {
                  // store follows in localstorage
                  follows.set(res);
                  // redirect to newsfeed
                  setTimeout(() => {
                    setLoading(false);
                    router.push('/feed/following');
                  }, 1500);
                })
                .catch(console.error);
            }
          })
          .catch(console.error);
      })
      .catch(console.error);
  }, [getAccount, getFollows, initDB, notification, router]);

  return (
    <div className="relative flex h-full flex-col items-center justify-between">
      <div>{/* spacer */}</div>
      <div className="flex flex-col items-center gap-4">
        <motion.div layoutId="logo" className="relative">
          <LumeSymbol className="h-16 w-16 text-white" />
        </motion.div>
        <div className="flex flex-col items-center gap-0.5">
          <motion.h2 layoutId="subtitle" className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-4xl font-medium text-transparent">
            A censorship-resistant social network
          </motion.h2>
          <motion.h1
            layoutId="title"
            className="bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 bg-clip-text text-5xl font-bold text-transparent">
            built on nostr
          </motion.h1>
        </div>
      </div>
      <div className="flex items-center gap-2 pb-16">
        <div className="h-10">
          {loading ? (
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
      </div>
      {/* background */}
      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-400/10 to-orange-100/10 opacity-100 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
        <svg
          aria-hidden="true"
          className="dark:fill-white/2.5 absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:stroke-white/5">
          <defs>
            <pattern id=":R11d6:" width="72" height="56" patternUnits="userSpaceOnUse" x="-12" y="4">
              <path d="M.5 56V.5H72" fill="none"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#:R11d6:)"></rect>
          <svg x="-12" y="4" className="overflow-visible">
            <rect strokeWidth="0" width="73" height="57" x="288" y="168"></rect>
            <rect strokeWidth="0" width="73" height="57" x="144" y="56"></rect>
            <rect strokeWidth="0" width="73" height="57" x="504" y="168"></rect>
            <rect strokeWidth="0" width="73" height="57" x="720" y="336"></rect>
          </svg>
        </svg>
      </div>
      {/* end background */}
    </div>
  );
}

Page.getLayout = function getLayout(
  page: string | number | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | ReactFragment | ReactPortal
) {
  return (
    <BaseLayout>
      <FullLayout>{page}</FullLayout>
    </BaseLayout>
  );
};
