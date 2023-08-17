import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { User } from '@app/auth/components/user';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, LoaderIcon } from '@shared/icons';

import { useOnboarding } from '@stores/onboarding';

import { useNostr } from '@utils/hooks/useNostr';

export function ImportStep3Screen() {
  const navigate = useNavigate();
  const setStep = useOnboarding((state) => state.setStep);

  const [loading, setLoading] = useState(false);

  const { db } = useStorage();
  const { fetchUserData } = useNostr();

  const submit = async () => {
    try {
      // show loading indicator
      setLoading(true);

      const data = await fetchUserData();

      if (data.status === 'ok') {
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
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold">
          {loading ? 'Prefetching data...' : 'Continue with'}
        </h1>
      </div>
      <div className="w-full rounded-xl bg-white/10 p-4">
        <div className="flex flex-col gap-3">
          <User pubkey={db.account.pubkey} />
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none"
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
        </div>
      </div>
    </div>
  );
}
