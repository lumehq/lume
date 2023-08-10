import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { User } from '@app/auth/components/user';

import { updateAccount } from '@libs/storage';

import { ArrowRightCircleIcon, CheckCircleIcon, LoaderIcon } from '@shared/icons';

import { useOnboarding } from '@stores/onboarding';

import { useAccount } from '@utils/hooks/useAccount';
import { useNostr } from '@utils/hooks/useNostr';
import { arrayToNIP02 } from '@utils/transform';

export function OnboardStep1Screen() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setStep = useOnboarding((state) => state.setStep);

  const { publish, fetchNotes } = useNostr();
  const { account } = useAccount();
  const { status, data } = useQuery(['trending-profiles'], async () => {
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

      const tags = arrayToNIP02([...follows, account.pubkey]);
      const event = await publish({ content: '', kind: 3, tags: tags });
      await updateAccount('follows', follows);

      // prefetch notes with current follows
      const notes = await fetchNotes(follows);

      // redirect to next step
      if (event && notes) {
        setTimeout(() => {
          queryClient.invalidateQueries(['currentAccount']);
          navigate('/auth/onboarding/step-2', { replace: true });
        }, 1000);
      }
    } catch {
      console.log('error');
    }
  };

  useEffect(() => {
    // save current step, if user close app and reopen it
    setStep('/auth/onboarding');
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-white">
          {loading ? 'Prefetching data...' : 'Enrich your network'}
        </h1>
        <p className="text-sm text-white/50">Choose account you want to follow</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="scrollbar-hide flex h-[500px] w-full flex-col overflow-y-auto rounded-xl bg-white/10">
          {status === 'loading' ? (
            <div className="flex h-full w-full items-center justify-center">
              <LoaderIcon className="h-4 w-4 animate-spin text-white" />
            </div>
          ) : (
            data?.profiles.map(
              (item: { pubkey: string; profile: { content: string } }) => (
                <button
                  key={item.pubkey}
                  type="button"
                  onClick={() => toggleFollow(item.pubkey)}
                  className="inline-flex transform items-center justify-between bg-white/10 px-4 py-2 hover:bg-white/20"
                >
                  <User pubkey={item.pubkey} fallback={item.profile?.content} />
                  {follows.includes(item.pubkey) && (
                    <div>
                      <CheckCircleIcon className="h-4 w-4 text-green-400" />
                    </div>
                  )}
                </button>
              )
            )
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={loading || follows.length === 0}
            className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none disabled:opacity-50"
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
          <Link
            to="/auth/onboarding/step-2"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg px-6 font-medium leading-none text-white hover:bg-white/10 focus:outline-none"
          >
            Skip, you can add later
          </Link>
        </div>
      </div>
    </div>
  );
}
