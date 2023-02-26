/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import OnboardingLayout from '@layouts/onboardingLayout';

import { currentUser } from '@stores/currentUser';

import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { dateToUnix, useNostr } from 'nostr-react';
import { generatePrivateKey, getEventHash, getPublicKey, nip19, signEvent } from 'nostr-tools';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useState } from 'react';
import Database from 'tauri-plugin-sql-api';
import { Config, names, uniqueNamesGenerator } from 'unique-names-generator';

const config: Config = {
  dictionaries: [names],
};

const defaultAvatars = [
  'https://bafybeidfsbrzqbvontmucteomoz2rkrxugu462l5hyhh6uioslkfzzs4oq.ipfs.w3s.link/avatar-11.png',
  'https://bafybeid7mrvznbnd6r2ju2iu7lsxkcikufys6z6ssy5ldxrxq5qh3yqf4u.ipfs.w3s.link/avatar-12.png',
  'https://bafybeih5gpwu53ohui6p7scekjpxjk2d4lusq2jqohqhjsvhfkeu56ea4e.ipfs.w3s.link/avatar-13.png',
  'https://bafybeibpbvrpuphkerjygdbnh26av5brqggzunbbbmfl3ozlvcn2mj6zxa.ipfs.w3s.link/avatar-14.png',
  'https://bafybeia4ue4loinuflu7y5q3xu6hcvt653mzw5yorw25oarf2wqksig4ma.ipfs.w3s.link/avatar-15.png',
  'https://bafybeib3gzl6n2bebiru2cpkdljmlzbtqfsl6xcnqtabxt6jrpj7l7ltm4.ipfs.w3s.link/avatar-16.png',
];

const defaultBanners = [
  'https://bafybeiacwit7hjmdefqggxqtgh6ht5dhth7ndptwn2msl5kpkodudsr7py.ipfs.w3s.link/banner-1.jpg',
  'https://bafybeiderllqadxsikh3envikobmyka3uwgojriwh6epctqartq2loswyi.ipfs.w3s.link/banner-2.jpg',
  'https://bafybeiba4tifde2kczvd26vxhbb5jpqi3wmgvccpkcrle4hse2cqrwlwiy.ipfs.w3s.link/banner-3.jpg',
  'https://bafybeifqpny2eom7ccvmaguxxxfajutmn5h3fotaasga7gce2xfx37p6oy.ipfs.w3s.link/banner-4.jpg',
];

export default function Page() {
  const router = useRouter();
  const { publish } = useNostr();

  const [type, setType] = useState('password');
  const [loading, setLoading] = useState(false);

  const [privKey] = useState(() => generatePrivateKey());
  const [name] = useState(() => uniqueNamesGenerator(config).toString());
  const [avatar] = useState(() => defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)]);
  const [banner] = useState(() => defaultBanners[Math.floor(Math.random() * defaultBanners.length)]);

  const pubKey = getPublicKey(privKey);
  const npub = nip19.npubEncode(pubKey);
  const nsec = nip19.nsecEncode(privKey);

  // auto-generated profile
  const data = {
    display_name: name,
    name: name,
    username: name.toLowerCase(),
    picture: avatar,
    banner: banner,
  };

  const createAccount = async () => {
    setLoading(true);

    // publish account to relays
    const event: any = {
      content: JSON.stringify(data),
      created_at: dateToUnix(),
      kind: 0,
      pubkey: pubKey,
      tags: [],
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, privKey);
    publish(event);

    // save account to database
    const db = await Database.load('sqlite:lume.db');
    await db.execute(
      `INSERT INTO accounts (id, privkey, npub, nsec, metadata) VALUES ("${pubKey}", "${privKey}", "${npub}", "${nsec}", '${JSON.stringify(data)}')`
    );
    await db.close();

    // set currentUser in global state
    currentUser.set({
      metadata: JSON.stringify(data),
      npub: npub,
      privkey: privKey,
      pubkey: pubKey,
    });

    // redirect to pre-follow
    setTimeout(() => {
      setLoading(false);
      router.push('/onboarding/following');
    }, 1500);
  };

  const showNsec = () => {
    if (type === 'password') {
      setType('text');
    } else {
      setType('password');
    }
  };

  return (
    <div className="flex h-full flex-col justify-between px-8">
      <div>{/* spacer */}</div>
      <motion.div layoutId="form">
        <div className="mb-8 flex flex-col gap-3">
          <motion.h1 layoutId="title" className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-3xl font-medium text-transparent">
            Create new key
          </motion.h1>
          <motion.h2 layoutId="subtitle" className="w-3/4 text-zinc-400">
            Lume will generate key with default profile for you, you can edit it later, and please store your key safely so you can restore your
            account or use other client
          </motion.h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-zinc-400">Public Key</label>
            <div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
              <input
                readOnly
                value={npub}
                className="relative w-full rounded-lg border border-black/5 px-3.5 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-600"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-zinc-400">Private Key</label>
            <div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
              <input
                readOnly
                type={type}
                value={nsec}
                className="relative w-full rounded-lg border border-black/5 px-3.5 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-600"
              />
              <button onClick={() => showNsec()} className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-zinc-700">
                {type === 'password' ? (
                  <EyeClosedIcon className="h-5 w-5 text-zinc-500 group-hover:text-zinc-200" />
                ) : (
                  <EyeOpenIcon className="h-5 w-5 text-zinc-500 group-hover:text-zinc-200" />
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-zinc-400">Default Profile (you can change it later)</label>
            <div className="relative max-w-sm shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
              <div className="relative max-w-sm rounded-lg border border-black/5 px-3.5 py-4 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200  dark:shadow-black/10 dark:placeholder:text-zinc-600">
                <div className="flex space-x-4">
                  <div className="relative h-10 w-10 rounded-full">
                    <Image className="inline-block rounded-full" src={data.picture} alt="" fill={true} />
                  </div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{data.display_name}</p>
                      <p className="text-zinc-400">@{data.username}</p>
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
                onClick={() => createAccount()}
                className="transform rounded-lg border border-white/10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 px-3.5 py-2 font-medium shadow-input shadow-black/5 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-black/10">
                <span className="drop-shadow-lg">Continue →</span>
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
