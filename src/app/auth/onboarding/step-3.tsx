import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserRelay } from '@app/auth/components/userRelay';

import { useNDK } from '@libs/ndk/provider';
import { createRelay } from '@libs/storage';

import { ArrowRightCircleIcon, CheckCircleIcon, LoaderIcon } from '@shared/icons';

import { FULL_RELAYS } from '@stores/constants';

import { useAccount } from '@utils/hooks/useAccount';
import { usePublish } from '@utils/hooks/usePublish';

export function OnboardStep3Screen() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [relays, setRelays] = useState(new Set<string>());

  const { publish } = usePublish();
  const { account } = useAccount();
  const { fetcher, relayUrls } = useNDK();
  const { status, data } = useQuery(
    ['relays'],
    async () => {
      const tmp = new Map<string, string>();
      const events = await fetcher.fetchAllEvents(
        relayUrls,
        { kinds: [10002], authors: account.follows },
        { since: 0 }
      );

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
      enabled: account ? true : false,
    }
  );

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
    setLoading(true);
    try {
      if (!skip) {
        for (const relay of relays) {
          await createRelay(relay);
        }

        const tags = Array.from(relays).map((relay) => ['r', relay.replace(/\/+$/, '')]);
        await publish({ content: '', kind: 10002, tags: tags });
      } else {
        for (const relay of FULL_RELAYS) {
          await createRelay(relay);
        }
      }

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    } catch (e) {
      setLoading(false);
      console.log('error: ', e);
    }
  };

  const relaysAsArray = Array.from(data?.keys() || []);

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
            className="text-fuchsia-500 underline"
          >
            here (nostr.com)
          </a>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="scrollbar-hide relative flex h-[500px] w-full flex-col divide-y divide-white/10 overflow-y-auto rounded-xl bg-white/10">
          {status === 'loading' ? (
            <div className="flex h-full w-full items-center justify-center">
              <LoaderIcon className="h-4 w-4 animate-spin text-white" />
            </div>
          ) : (
            relaysAsArray.map((item, index) => (
              <button
                key={item + index}
                type="button"
                onClick={() => toggleRelay(item)}
                className="inline-flex transform items-start justify-between bg-white/10 px-4 py-2 hover:bg-white/20"
              >
                <div className="flex flex-col items-start gap-1">
                  {item.replace(/\/+$/, '')}
                  <UserRelay pubkey={data.get(item)} />
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
            className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none disabled:opacity-50"
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
            className="inline-flex h-11 w-full items-center justify-center rounded-lg px-6 font-medium leading-none text-white hover:bg-white/10 focus:outline-none"
          >
            Skip, use default relays
          </button>
        </div>
      </div>
    </div>
  );
}
