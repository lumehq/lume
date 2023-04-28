import { DEFAULT_AVATAR, READONLY_RELAYS } from '@lume/stores/constants';
import { onboardingAtom } from '@lume/stores/onboarding';
import { shortenKey } from '@lume/utils/shortenKey';
import { createAccount, createPleb } from '@lume/utils/storage';

import { useAtom } from 'jotai';
import { RelayPool } from 'nostr-relaypool';
import { getPublicKey } from 'nostr-tools';
import { useMemo, useState } from 'react';
import useSWRSubscription from 'swr/subscription';
import { navigate } from 'vite-plugin-ssr/client/router';

export function Page() {
  const [loading, setLoading] = useState(false);
  const [onboarding, setOnboarding] = useAtom(onboardingAtom);
  const pubkey = useMemo(() => (onboarding.privkey ? getPublicKey(onboarding.privkey) : ''), [onboarding.privkey]);

  const { data: user, error } = useSWRSubscription(
    pubkey && !loading
      ? [
          {
            kinds: [0, 3],
            authors: [pubkey],
          },
        ]
      : null,
    (key, { next }) => {
      const pool = new RelayPool(READONLY_RELAYS);

      const unsubscribe = pool.subscribe(key, READONLY_RELAYS, (event: any) => {
        switch (event.kind) {
          case 0:
            // update state
            next(null, JSON.parse(event.content));
            // create account
            setOnboarding((prev) => ({ ...prev, metadata: event.content }));
            break;
          case 3:
            setOnboarding((prev) => ({ ...prev, follows: event.tags }));
            break;
          default:
            break;
        }
      });

      return () => {
        unsubscribe();
      };
    }
  );

  const submit = () => {
    // show loading indicator
    setLoading(true);

    const follows = onboarding.follows.concat([['p', pubkey]]);
    // insert to database
    createAccount(pubkey, onboarding.privkey, onboarding.metadata, follows, 1)
      .then((res) => {
        if (res) {
          for (const tag of onboarding.follows) {
            fetch(`https://rbr.bio/${tag[1]}/metadata.json`)
              .then((data) => data.json())
              .then((data) => createPleb(tag[1], data ?? ''));
          }
          setTimeout(() => navigate('/', { overwriteLastHistoryEntry: true }), 2000);
        } else {
          console.error();
        }
      })
      .catch(console.error);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold">{loading ? 'Creating...' : 'Continue with'}</h1>
        </div>
        <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          {error && <div>Failed to load profile</div>}
          {!user ? (
            <div className="w-full">
              <div className="flex items-center gap-2">
                <div className="h-11 w-11 animate-pulse rounded-lg bg-zinc-800"></div>
                <div>
                  <h3 className="mb-1 h-4 w-16 animate-pulse rounded bg-zinc-800"></h3>
                  <p className="h-3 w-36 animate-pulse rounded bg-zinc-800"></p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <img
                  className="relative inline-flex h-11 w-11 rounded-lg ring-2 ring-zinc-900"
                  src={user.picture || DEFAULT_AVATAR}
                  alt={pubkey}
                />
                <div>
                  <h3 className="font-medium leading-none text-zinc-200">{user.display_name || user.name}</h3>
                  <p className="text-sm text-zinc-400">{user.nip05 || shortenKey(pubkey)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => submit()}
                className="inline-flex h-10 w-full transform items-center justify-center rounded-lg bg-fuchsia-500 px-3.5 font-medium text-white shadow-button hover:bg-fuchsia-600 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <svg
                    className="h-5 w-5 animate-spin text-black dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <span>Continue →</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
