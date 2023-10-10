import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, CheckCircleIcon, LoaderIcon } from '@shared/icons';
import { User } from '@shared/user';

import { FULL_RELAYS } from '@stores/constants';
import { useOnboarding } from '@stores/onboarding';

import { useNostr } from '@utils/hooks/useNostr';

export function OnboardStep3Screen() {
  const navigate = useNavigate();

  const [setStep, clearStep] = useOnboarding((state) => [state.setStep, state.clearStep]);
  const [loading, setLoading] = useState(false);
  const [relays, setRelays] = useState(new Set<string>());

  const { publish } = useNostr();
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, data } = useQuery(
    ['relays'],
    async () => {
      const tmp = new Map<string, string>();
      const events = await ndk.fetchEvents({
        kinds: [10002],
        authors: db.account.follows,
      });

      if (events) {
        events.forEach((event) => {
          event.tags.forEach((tag) => {
            tmp.set(tag[1], event.pubkey);
          });
        });
      }

      return tmp;
    },
    {
      enabled: db.account ? true : false,
      refetchOnWindowFocus: false,
    }
  );

  const relaysAsArray = Array.from(data?.keys() || []);

  const toggleRelay = (relay: string) => {
    if (relays.has(relay)) {
      setRelays((prev) => {
        prev.delete(relay);
        return new Set(prev);
      });
    } else {
      setRelays((prev) => new Set(prev.add(relay)));
    }
  };

  const submit = async (skip?: boolean) => {
    try {
      setLoading(true);

      if (!skip) {
        for (const relay of relays) {
          await db.createRelay(relay);
        }

        const tags = Array.from(relays).map((relay) => ['r', relay.replace(/\/+$/, '')]);
        await publish({ content: '', kind: 10002, tags: tags });
      } else {
        for (const relay of FULL_RELAYS) {
          await db.createRelay(relay);
        }
      }

      // update last login
      await db.updateLastLogin();

      clearStep();
      navigate('/', { replace: true });
    } catch (e) {
      setLoading(false);
      console.log('error: ', e);
    }
  };

  useEffect(() => {
    // save current step, if user close app and reopen it
    setStep('/auth/onboarding/step-3');
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-white">Relay discovery</h1>
        <p className="text-sm text-white/50">
          You can add relay which is using by who you&apos;re following to easier reach
          their content. Learn more about relay{' '}
          <a
            href="https://nostr.com/relays"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            here (nostr.com)
          </a>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="relative flex h-[500px] w-full flex-col divide-y divide-white/10 overflow-y-auto rounded-xl bg-white/10 backdrop-blur-xl scrollbar-none">
          {status === 'loading' ? (
            <div className="flex h-full w-full items-center justify-center">
              <LoaderIcon className="h-4 w-4 animate-spin text-white" />
            </div>
          ) : relaysAsArray.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center px-6">
              <p className="text-center text-white/50">
                Lume couldn&apos;t find any relays from your follows.
                <br />
                You can skip this step and use default relays instead.
              </p>
            </div>
          ) : (
            relaysAsArray.map((item, index) => (
              <button
                key={item + index}
                type="button"
                onClick={() => toggleRelay(item)}
                className="inline-flex transform items-start justify-between bg-white/10 px-4 py-2 backdrop-blur-xl hover:bg-white/20"
              >
                <div className="flex flex-col items-start gap-1">
                  <p className="max-w-[15rem] truncate">{item.replace(/\/+$/, '')}</p>
                  <User pubkey={data.get(item)} variant="mention" />
                </div>
                {relays.has(item) && (
                  <div className="pt-1.5">
                    <CheckCircleIcon className="h-4 w-4 text-green-400" />
                  </div>
                )}
              </button>
            ))
          )}
          {relays.size > 5 && (
            <div className="sticky bottom-0 left-0 inline-flex w-full items-center justify-center bg-white/10 px-4 py-2 backdrop-blur-2xl">
              <p className="text-sm text-orange-400">
                Using too much relay can cause high resource usage
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => submit()}
            className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-blue-500 px-6 font-medium leading-none text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-5" />
                <span>Creating...</span>
                <LoaderIcon className="h-5 w-5 animate-spin text-white" />
              </>
            ) : (
              <>
                <span className="w-5" />
                <span>Add {relays.size} relays & Continue</span>
                <ArrowRightCircleIcon className="h-5 w-5" />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => submit(true)}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg px-6 font-medium leading-none text-white backdrop-blur-xl hover:bg-white/10 focus:outline-none"
          >
            Skip, use Lume default relays
          </button>
        </div>
      </div>
    </div>
  );
}
