import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserImport } from '@app/auth/components/userImport';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';

import { useOnboarding } from '@stores/onboarding';

import { useNostr } from '@utils/hooks/useNostr';

export function ImportStep3Screen() {
  const navigate = useNavigate();
  const setStep = useOnboarding((state) => state.setStep);

  const { db } = useStorage();
  const { fetchUserData, prefetchEvents } = useNostr();

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      // show loading indicator
      setLoading(true);

      // prefetch data
      const user = await fetchUserData();
      const data = await prefetchEvents();

      // redirect to next step
      if (user.status === 'ok' && data.status === 'ok') {
        navigate('/auth/onboarding/step-2', { replace: true });
      } else {
        console.log('error: ', data.message);
        setLoading(false);
      }
    } catch (e) {
      console.log('error: ', e);
      setLoading(false);
    }
  };

  useEffect(() => {
    // save current step, if user close app and reopen it
    setStep('/auth/import/step-3');
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-4 pb-4">
        <h1 className="text-center text-2xl font-semibold text-white">
          {loading ? 'Prefetching data...' : 'Your Nostr profile'}
        </h1>
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border-t border-white/10 bg-white/20 px-3 py-3">
          <UserImport pubkey={db.account.pubkey} />
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="inline-flex h-12 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none"
            onClick={() => submit()}
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
                <span>Continue</span>
                <ArrowRightCircleIcon className="h-5 w-5" />
              </>
            )}
          </button>
          <span className="text-center text-sm text-white/50">
            By clicking &apos;Continue&apos;, Lume will download your relay list and all
            events from the last 24 hours. It may take a bit
          </span>
        </div>
      </div>
    </div>
  );
}
