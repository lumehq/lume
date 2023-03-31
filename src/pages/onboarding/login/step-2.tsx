import BaseLayout from '@layouts/base';

import { RelayContext } from '@components/relaysProvider';

import { createAccount, createFollows } from '@utils/storage';
import { tagsToArray } from '@utils/transform';
import { truncate } from '@utils/truncate';

import destr from 'destr';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getPublicKey, nip19 } from 'nostr-tools';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useContext,
  useEffect,
  useState,
} from 'react';

export default function Page() {
  const [pool, relays]: any = useContext(RelayContext);

  const router = useRouter();
  const privkey: any = router.query.privkey || null;
  const pubkey = privkey ? getPublicKey(privkey) : null;

  const [profile, setProfile] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const unsubscribe = pool.subscribe(
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
          const data = {
            pubkey: pubkey,
            privkey: privkey,
            npub: nip19.npubEncode(pubkey),
            nsec: nip19.nsecEncode(privkey),
            metadata: event.content,
          };
          setProfile(destr(event.content));
          createAccount(data);
        } else {
          if (event.tags.length > 0) {
            createFollows(tagsToArray(event.tags), pubkey, 0);
          }
        }
      },
      undefined,
      () => {
        setDone(true);
      },
      {
        unsubscribeOnEose: true,
      }
    );

    return () => {
      unsubscribe;
    };
  }, [pool, privkey, pubkey, relays]);

  // submit then redirect to home
  const submit = () => {
    router.replace('/');
  };

  return (
    <div className="grid h-full w-full grid-rows-5">
      <div className="row-span-1 flex items-center justify-center">
        <div>
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
                  <Image className="inline-block rounded-full" src={profile?.picture} alt="" fill={true} />
                </div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{profile?.display_name || profile?.name}</p>
                    <span className="leading-tight text-zinc-500">·</span>
                    <p className="text-zinc-500">@{profile?.username || (pubkey && truncate(pubkey, 16, ' .... '))}</p>
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
          <div className="flex items-center justify-center">
            {done === false ? (
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
                className="inline-flex w-full transform items-center justify-center rounded-lg bg-gradient-to-r from-fuchsia-300 via-orange-100 to-amber-300 px-3.5 py-2.5 font-medium text-zinc-800 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <span className="drop-shadow-lg">Done →</span>
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
