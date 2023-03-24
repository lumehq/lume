import BaseLayout from '@layouts/base';

import { RelayContext } from '@components/relaysProvider';

import { relaysAtom } from '@stores/relays';

import { createAccount, createFollows } from '@utils/storage';
import { tagsToArray } from '@utils/transform';
import { truncate } from '@utils/truncate';

import destr from 'destr';
import { useAtomValue } from 'jotai';
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
  const pool: any = useContext(RelayContext);

  const router = useRouter();
  const privkey: any = router.query.privkey;
  const pubkey = getPublicKey(privkey);

  const relays = useAtomValue(relaysAtom);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    pool.subscribe(
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
      undefined,
      {
        unsubscribeOnEose: true,
      }
    );
  }, [pool, privkey, pubkey, relays]);

  // submit then redirect to home
  const submit = () => {
    router.push('/');
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
                    <p className="text-zinc-500">@{profile?.username || truncate(pubkey, 16, ' .... ')}</p>
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
          <button
            onClick={() => submit()}
            className="inline-flex w-full transform items-center justify-center rounded-lg bg-gradient-to-r from-fuchsia-300 via-orange-100 to-amber-300 px-3.5 py-2.5 font-medium text-zinc-800 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span className="drop-shadow-lg">Done →</span>
          </button>
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
