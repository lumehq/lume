import BaseLayout from '@layouts/base';

import { RelayContext } from '@components/relaysProvider';

import { createAccount } from '@utils/storage';

import { ArrowLeftIcon, EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { generatePrivateKey, getEventHash, getPublicKey, nip19, signEvent } from 'nostr-tools';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useMemo, useState } from 'react';
import { Config, names, uniqueNamesGenerator } from 'unique-names-generator';

const config: Config = {
  dictionaries: [names],
};

export default function Page() {
  const router = useRouter();
  const [pool, relays]: any = useContext(RelayContext);

  const [type, setType] = useState('password');
  const [loading, setLoading] = useState(false);

  const [privKey] = useState(() => generatePrivateKey());
  const [name] = useState(() => uniqueNamesGenerator(config).toString());

  const pubKey = getPublicKey(privKey);
  const npub = nip19.npubEncode(pubKey);
  const nsec = nip19.nsecEncode(privKey);

  const goBack = () => {
    router.back();
  };

  // auto-generated profile metadata
  const metadata = useMemo(
    () => ({
      display_name: name,
      name: name,
      username: name.toLowerCase(),
      picture: 'https://void.cat/d/KmypFh2fBdYCEvyJrPiN89',
    }),
    [name]
  );

  // build profile
  const data = useMemo(
    () => ({
      pubkey: pubKey,
      privkey: privKey,
      npub: npub,
      nsec: nsec,
      metadata: metadata,
    }),
    [metadata, npub, nsec, privKey, pubKey]
  );

  // toggle privatek key
  const showPrivateKey = () => {
    if (type === 'password') {
      setType('text');
    } else {
      setType('password');
    }
  };

  // create account and broadcast to all relays
  const submit = () => {
    setLoading(true);

    // build event
    const event: any = {
      content: JSON.stringify(metadata),
      created_at: Math.floor(Date.now() / 1000),
      kind: 0,
      pubkey: pubKey,
      tags: [],
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, privKey);

    // insert to database then broadcast
    createAccount(data)
      .then(() => {
        pool.publish(event, relays);
        router.push({
          pathname: '/onboarding/create/step-2',
          query: { id: pubKey, privkey: privKey },
        });
      })
      .catch(console.error);
  };

  return (
    <div className="grid h-full w-full grid-rows-5">
      <div className="row-span-1 mx-auto flex w-full max-w-md items-center justify-between">
        <button
          onClick={() => goBack()}
          className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900"
        >
          <ArrowLeftIcon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
        </button>
        <div>
          <h1 className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-3xl font-medium text-transparent">
            Create new account
          </h1>
        </div>
        <div></div>
      </div>
      <div className="row-span-4">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-zinc-400">Public Key</label>
              <div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
                <input
                  readOnly
                  value={npub}
                  className="relative w-full rounded-lg border border-black/5 px-3.5 py-2.5 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-600"
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
                  className="relative w-full rounded-lg border border-black/5 py-2.5 pl-3.5 pr-11 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-600"
                />
                <button
                  onClick={() => showPrivateKey()}
                  className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-zinc-700"
                >
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
              <div className="relative w-full shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
                <div className="relative w-full rounded-lg border border-black/5 px-3.5 py-4 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200  dark:shadow-black/10 dark:placeholder:text-zinc-600">
                  <div className="flex space-x-2">
                    <div className="relative h-11 w-11 rounded-md">
                      <Image className="inline-block rounded-md" src={metadata.picture} alt="" fill={true} />
                    </div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="flex items-center gap-1">
                        <p className="font-semibold">{metadata.display_name}</p>
                        <p className="text-zinc-400">@{metadata.username}</p>
                      </div>
                      <div className="space-y-1">
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
          <div className="flex h-10 items-center justify-center">
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
              <button
                onClick={() => submit()}
                className="w-full transform rounded-lg bg-gradient-to-r from-fuchsia-300 via-orange-100 to-amber-300 px-3.5 py-2.5 font-medium text-zinc-800 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <span className="drop-shadow-lg">Continue →</span>
              </button>
            )}
          </div>
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
