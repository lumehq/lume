import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { ArrowLeftIcon, CheckCircleIcon, LoaderIcon } from '@shared/icons';
import { User } from '@shared/user';

import { useOnboarding } from '@stores/onboarding';

import { useNostr } from '@utils/hooks/useNostr';

export function OnboardRelaysScreen() {
  const navigate = useNavigate();
  const toggleRelays = useOnboarding((state) => state.toggleRelays);

  const [loading, setLoading] = useState(false);
  const [relays, setRelays] = useState(new Set<string>());

  const { db } = useStorage();
  const { ndk } = useNDK();
  const { getAllRelaysByUsers } = useNostr();
  const { status, data } = useQuery(
    ['relays'],
    async () => {
      return await getAllRelaysByUsers();
    },
    {
      refetchOnWindowFocus: false,
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

  const submit = async () => {
    try {
      setLoading(true);

      for (const relay of relays) {
        await db.createRelay(relay);
      }

      const tags = Array.from(relays).map((relay) => ['r', relay.replace(/\/+$/, '')]);
      const event = new NDKEvent(ndk);
      event.content = '';
      event.kind = 10002;
      event.created_at = Math.floor(Date.now() / 1000);
      event.tags = tags;

      await event.publish();

      toggleRelays();
      navigate(-1);
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col justify-center">
      <div className="absolute left-[8px] top-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium"
        >
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            <ArrowLeftIcon className="h-5 w-5" />
          </div>
          Back
        </button>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col gap-10 px-3">
        <h1 className="text-center text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Relay discovery
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex h-[420px] w-full flex-col overflow-y-auto rounded-xl bg-neutral-100 dark:bg-neutral-900">
            {status === 'loading' ? (
              <div className="flex h-full w-full items-center justify-center">
                <LoaderIcon className="h-4 w-4 animate-spin text-neutral-900 dark:text-neutral-100" />
              </div>
            ) : data.size === 0 ? (
              <div className="flex h-full w-full items-center justify-center px-6">
                <p className="text-center text-neutral-300 dark:text-neutral-600">
                  Lume couldn&apos;t find any relays from your follows.
                  <br />
                  You can skip this step and use default relays instead.
                </p>
              </div>
            ) : (
              [...data].map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleRelay(key)}
                  className="inline-flex transform items-start justify-between px-4 py-2 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="inline-flex items-center gap-2">
                      <div className="pt-1.5">
                        {relays.has(key) ? (
                          <CheckCircleIcon className="h-4 w-4 text-teal-500" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4 text-neutral-300 dark:text-neutral-700" />
                        )}
                      </div>
                      <p className="max-w-[15rem] truncate">{key.replace(/\/+$/, '')}</p>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Used by
                      </span>
                      <div className="isolate flex -space-x-2">
                        {value.slice(0, 3).map((item) => (
                          <User key={item} pubkey={item} variant="stacked" />
                        ))}
                        {value.length > 3 ? (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-900 ring-1 ring-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-700">
                            <span className="text-xs font-medium">+{value.length}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          <button
            type="button"
            onClick={() => submit()}
            disabled={loading}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <span>Add {relays.size} relays & Continue</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
