import { DEFAULT_AVATAR, READONLY_RELAYS } from '@lume/stores/constants';
import { onboardingAtom } from '@lume/stores/onboarding';
import { shortenKey } from '@lume/utils/shortenKey';

import { useAtom } from 'jotai';
import { RelayPool } from 'nostr-relaypool';
import { getPublicKey } from 'nostr-tools';
import { useMemo } from 'react';
import useSWRSubscription from 'swr/subscription';

export function Page() {
  const [onboarding, setOnboarding] = useAtom(onboardingAtom);
  const pubkey = useMemo(() => (onboarding.privkey ? getPublicKey(onboarding.privkey) : ''), [onboarding.privkey]);

  const submit = () => {
    console.log('click');
  };

  const { data: user, error } = useSWRSubscription(
    pubkey
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
            console.log(event);
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

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold">Continue with</h1>
        </div>
        <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          {error && <div>Failed to load profile</div>}
          {!user ? (
            <div className="h-44 w-full animate-pulse bg-zinc-800"></div>
          ) : (
            <div className="flex flex-col gap-4">
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
                className="w-full transform rounded-lg bg-fuchsia-500 px-3.5 py-2.5 font-medium text-white shadow-button hover:bg-fuchsia-600 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="drop-shadow-lg">Continue →</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
