import { getPublicKey, nip19 } from 'nostr-tools';
import { useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';
import { ArrowRightCircleIcon } from '@shared/icons/arrowRightCircle';

import { useOnboarding } from '@stores/onboarding';

type FormValues = {
  privkey: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.privkey ? values : {},
    errors: !values.privkey
      ? {
          privkey: {
            type: 'required',
            message: 'This is required.',
          },
        }
      : {},
  };
};

export function ImportStep1Screen() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [passwordInput, setPasswordInput] = useState('password');
  const [setStep, setPubkey, setTempPrivkey] = useOnboarding((state) => [
    state.setStep,
    state.setPubkey,
    state.setTempPrivkey,
  ]);

  const { db } = useStorage();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ resolver });

  const onSubmit = async (data: { [x: string]: string }) => {
    try {
      setLoading(true);

      let privkey = data['privkey'];
      if (privkey.substring(0, 4) === 'nsec') {
        privkey = nip19.decode(privkey).data as string;
      }

      if (typeof getPublicKey(privkey) === 'string') {
        const pubkey = getPublicKey(privkey);
        const npub = nip19.npubEncode(pubkey);

        setTempPrivkey(privkey);
        setPubkey(pubkey);

        // add account to local database
        await db.createAccount(npub, pubkey);

        // redirect to step 2 with delay 1.2s
        setTimeout(() => navigate('/auth/import/step-2', { replace: true }), 1200);
      }
    } catch (error) {
      setLoading(false);
      setError('privkey', {
        type: 'custom',
        message: 'Private key is invalid, please check again',
      });
    }
  };

  // toggle private key
  const showPassword = () => {
    if (passwordInput === 'password') {
      setPasswordInput('text');
    } else {
      setPasswordInput('password');
    }
  };

  useEffect(() => {
    // save current step, if user close app and reopen it
    setStep('/auth/import');
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-4 pb-4">
        <h1 className="text-center text-2xl font-semibold text-white">
          Import your Nostr key
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-0 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="privkey" className="font-medium text-white">
              Insert your nostr private key, in nsec or hex format
            </label>
            <div className="relative">
              <input
                {...register('privkey', { required: true, minLength: 32 })}
                type={passwordInput}
                placeholder="nsec1..."
                className="relative h-12 w-full rounded-lg border-t border-white/10 bg-white/20 px-3 py-1 text-white backdrop-blur-xl placeholder:text-white/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => showPassword()}
                className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 backdrop-blur-xl hover:bg-white/20"
              >
                {passwordInput === 'password' ? (
                  <EyeOffIcon className="h-4 w-4 text-white/50 group-hover:text-white" />
                ) : (
                  <EyeOnIcon className="h-4 w-4 text-white/50 group-hover:text-white" />
                )}
              </button>
            </div>
            <span className="text-sm text-red-500">
              {errors.privkey && <p>{errors.privkey.message}</p>}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-12 w-full items-center justify-between gap-2 rounded-lg bg-blue-500 px-6 font-medium leading-none text-white hover:bg-blue-600 focus:outline-none"
            >
              {loading ? (
                <>
                  <span className="w-5" />
                  <span>Importing...</span>
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
        </form>
      </div>
    </div>
  );
}
