/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import OnboardingLayout from '@layouts/onboardingLayout';

import { truncate } from '@utils/truncate';

import { currentUser } from '@stores/currentUser';

import data from '@assets/directory.json';

import { useStore } from '@nanostores/react';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { nip19 } from 'nostr-tools';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

export default function Page() {
  const router = useRouter();
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const [follow, setFollow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [list] = useState(shuffle(data));
  const $currentUser: any = useStore(currentUser);

  const followUser = (e) => {
    const npub = e.currentTarget.getAttribute('data-npub');
    setFollow((arr) => [...arr, npub]);
  };

  const insertDB = async () => {
    const db = await Database.load('sqlite:lume.db');
    // self followed
    await db.execute(`INSERT INTO follows (pubkey, account) VALUES ("${$currentUser.pubkey}", "${$currentUser.pubkey}")`);
    follow.forEach(async (npub) => {
      const { data } = nip19.decode(npub);
      await db.execute(`INSERT INTO follows (pubkey, account) VALUES ("${data}", "${$currentUser.pubkey}")`);
    });
  };

  const createFollowing = async () => {
    setLoading(true);

    insertDB().then(() =>
      setTimeout(() => {
        setLoading(false);
        router.push('/');
      }, 1500)
    );
  };

  return (
    <div className="flex h-full flex-col justify-between px-8">
      <div>{/* spacer */}</div>
      <motion.div layoutId="form" className="flex flex-col">
        <div className="mb-8 flex flex-col gap-3">
          <motion.h1 layoutId="title" className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-3xl font-medium text-transparent">
            Choose 10 people you want to following
          </motion.h1>
          <motion.h2 layoutId="subtitle" className="w-3/4 text-zinc-400">
            For better experiences, you should follow the people you care about to personalize your newsfeed, otherwise you will be very bored
          </motion.h2>
        </div>
        <div className="h-full w-full shrink">
          <div className="scrollbar-hide grid grid-cols-3 gap-4 overflow-y-auto">
            {list.map((item, index) => (
              <div
                key={index}
                onClick={(e) => followUser(e)}
                data-npub={item.npub}
                className={`col-span-1 inline-flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-zinc-700 ${
                  follow.includes(item.npub) ? 'bg-zinc-800' : ''
                }`}>
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image className="rounded-full object-cover" src={item.avatar} alt={item.name} fill={true} />
                </div>
                <div className="inline-flex flex-1 items-center justify-between">
                  <div>
                    <p className="truncate text-sm font-medium text-zinc-200">{item.name}</p>
                    <p className="text-sm leading-tight text-zinc-500">{truncate(item.npub, 16, ' .... ')}</p>
                  </div>
                  <div>{follow.includes(item.npub) ? <CheckCircledIcon className="h-4 w-4 text-green-500" /> : <></>}</div>
                </div>
              </div>
            ))}
          </div>
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
            <div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
              <button
                onClick={() => createFollowing()}
                disabled={follow.length < 10 ? true : false}
                className="transform rounded-lg border border-white/10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 px-3.5 py-2 font-medium shadow-input shadow-black/5 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-black/10">
                <span className="drop-shadow-lg">Finish →</span>
              </button>
            </div>
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
