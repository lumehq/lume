import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { ArrowLeftIcon, CheckCircleIcon, LoaderIcon } from '@shared/icons';
import { User } from '@shared/user';

import { useOnboarding } from '@stores/onboarding';

import { arrayToNIP02 } from '@utils/transform';

export function OnboardEnrichScreen() {
  const { ndk } = useNDK();
  const { db } = useStorage();
  const { status, data } = useQuery({
    queryKey: ['trending-profiles-widget'],
    queryFn: async () => {
      const res = await fetch('https://api.nostr.band/v0/trending/profiles');
      if (!res.ok) {
        throw new Error('Error');
      }
      return res.json();
    },
  });

  const [loading, setLoading] = useState(false);
  const [follows, setFollows] = useState([]);

  const navigate = useNavigate();
  const setEnrich = useOnboarding((state) => state.toggleEnrich);

  // toggle follow state
  const toggleFollow = (pubkey: string) => {
    const arr = follows.includes(pubkey)
      ? follows.filter((i) => i !== pubkey)
      : [...follows, pubkey];
    setFollows(arr);
  };

  const submit = async () => {
    try {
      setLoading(true);

      const tags = arrayToNIP02(follows);
      const event = new NDKEvent(ndk);
      event.content = '';
      event.kind = NDKKind.Contacts;
      event.created_at = Math.floor(Date.now() / 1000);
      event.tags = tags;

      const publish = await event.publish();

      // redirect to next step
      if (publish) {
        db.account.follows = follows;

        await db.updateAccount('follows', JSON.stringify(follows));
        await db.updateAccount('circles', JSON.stringify(follows));

        setEnrich();
        navigate(-1);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      toast(e);
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
      <div className="mx-auto mb-8 w-full max-w-md px-3">
        <h1 className="text-center text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Enrich your network
        </h1>
      </div>
      <div className="flex w-full flex-nowrap items-center gap-4 overflow-x-auto px-4 scrollbar-none">
        {status === 'pending' ? (
          <div className="flex h-full w-full items-center justify-center">
            <LoaderIcon className="h-4 w-4 animate-spin text-neutral-900 dark:text-neutral-100" />
          </div>
        ) : (
          data?.profiles.map((item: { pubkey: string; profile: { content: string } }) => (
            <button
              key={item.pubkey}
              type="button"
              onClick={() => toggleFollow(item.pubkey)}
              className="relative h-[300px] shrink-0 grow-0 basis-[250px] overflow-hidden rounded-lg bg-neutral-200 px-4 py-4 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              <User
                pubkey={item.pubkey}
                variant="large"
                embedProfile={item.profile?.content}
              />
              {follows.includes(item.pubkey) && (
                <div className="absolute right-2 top-2">
                  <CheckCircleIcon className="h-5 w-5 text-teal-400" />
                </div>
              )}
            </button>
          ))
        )}
      </div>
      <div className="mx-auto mt-8 w-full max-w-md px-3">
        <button
          type="button"
          onClick={submit}
          disabled={loading || follows.length === 0}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" />
              <span>It might take a bit, please patient...</span>
            </>
          ) : (
            <span>Follow {follows.length} accounts & Continue</span>
          )}
        </button>
      </div>
    </div>
  );
}
