import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, CheckCircleIcon, LoaderIcon } from '@shared/icons';
import { User } from '@shared/user';

import { useOnboarding } from '@stores/onboarding';

import { useNostr } from '@utils/hooks/useNostr';
import { arrayToNIP02 } from '@utils/transform';

export function OnboardStep1Screen() {
  const navigate = useNavigate();
  const setStep = useOnboarding((state) => state.setStep);

  const { publish, fetchUserData, prefetchEvents } = useNostr();
  const { db } = useStorage();
  const { status, data } = useQuery(['trending-profiles-widget'], async () => {
    const res = await fetch('https://api.nostr.band/v0/trending/profiles');
    if (!res.ok) {
      throw new Error('Error');
    }
    return res.json();
  });

  const [loading, setLoading] = useState(false);
  const [follows, setFollows] = useState([]);

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

      const tags = arrayToNIP02([...follows, db.account.pubkey]);
      const event = await publish({ content: '', kind: 3, tags: tags });

      // prefetch data
      const user = await fetchUserData(follows);
      const data = await prefetchEvents();

      // redirect to next step
      if (event && user.status === 'ok' && data.status === 'ok') {
        navigate('/auth/onboarding/step-2', { replace: true });
      } else {
        setLoading(false);
        console.log('error: ', data.message);
      }
    } catch (e) {
      setLoading(false);
      console.log('error: ', e);
    }
  };

  useEffect(() => {
    // save current step, if user close app and reopen it
    setStep('/auth/onboarding');
  }, []);

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <div className="mx-auto mb-4 w-full max-w-md border-b border-white/10 pb-4">
        <h1 className="mb-2 text-center text-2xl font-semibold text-white">
          {loading ? 'Prefetching data...' : 'Enrich your network'}
        </h1>
        <p className="text-white/70">
          Choose the account you want to follow. These accounts are trending in the last
          24 hours. If none of the accounts interest you, you can explore more options and
          add them later.
        </p>
      </div>
      <div className="scrollbar-hide flex w-full flex-nowrap items-center gap-4 overflow-x-auto px-4">
        {status === 'loading' ? (
          <div className="flex h-full w-full items-center justify-center">
            <LoaderIcon className="h-4 w-4 animate-spin text-white" />
          </div>
        ) : (
          data?.profiles.map((item: { pubkey: string; profile: { content: string } }) => (
            <button
              key={item.pubkey}
              type="button"
              onClick={() => toggleFollow(item.pubkey)}
              className="relative h-[300px] shrink-0 grow-0 basis-[250px] rounded-lg border-t border-white/10 bg-white/20 px-4 py-4 hover:bg-white/30"
            >
              <User
                pubkey={item.pubkey}
                variant="large"
                embedProfile={item.profile?.content}
              />
              {follows.includes(item.pubkey) && (
                <div className="absolute right-2 top-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-400" />
                </div>
              )}
            </button>
          ))
        )}
      </div>
      <div className="mx-auto mt-4 w-full max-w-md">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={loading || follows.length === 0}
            className="inline-flex h-12 w-full items-center justify-between gap-2 rounded-lg border-t border-white/10 bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-5" />
                <span>It might take a bit, please patient...</span>
                <LoaderIcon className="h-5 w-5 animate-spin text-white" />
              </>
            ) : (
              <>
                <span className="w-5" />
                <span>Follow {follows.length} accounts & Continue</span>
                <ArrowRightCircleIcon className="h-5 w-5" />
              </>
            )}
          </button>
          {!loading ? (
            <Link
              to="/auth/onboarding/step-2"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg border-t border-white/10 bg-white/20 px-6 font-medium leading-none text-white backdrop-blur-xl hover:bg-white/30 focus:outline-none"
            >
              Skip, you can add later
            </Link>
          ) : (
            <span className="text-center text-sm text-white/50">
              By clicking &apos;Continue&apos;, Lume will download all events related to
              your follows from the last 24 hours. It may take a bit
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
