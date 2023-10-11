import { useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';
import { ArrowRightCircleIcon } from '@shared/icons/arrowRightCircle';

import { useOnboarding } from '@stores/onboarding';
import { useStronghold } from '@stores/stronghold';

type FormValues = {
  password: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.password ? values : {},
    errors: !values.password
      ? {
          password: {
            type: 'required',
            message: 'This is required.',
          },
        }
      : {},
  };
};

export function CreateStep2Screen() {
  const navigate = useNavigate();
  const setStep = useOnboarding((state) => state.setStep);
  const pubkey = useOnboarding((state) => state.pubkey);
  const privkey = useStronghold((state) => state.privkey);

  const [passwordInput, setPasswordInput] = useState('password');
  const [loading, setLoading] = useState(false);

  const { db } = useStorage();

  // toggle private key
  const showPassword = () => {
    if (passwordInput === 'password') {
      setPasswordInput('text');
    } else {
      setPasswordInput('password');
    }
  };

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ resolver });

  const onSubmit = async (data: { [x: string]: string }) => {
    setLoading(true);
    if (data.password.length > 3) {
      // save privkey to secure storage
      await db.secureSave(pubkey, privkey);

      // redirect to next step
      navigate('/auth/create/step-3', { replace: true });
    } else {
      setLoading(false);
      setError('password', {
        type: 'custom',
        message: 'Password is required and must be greater than 3',
      });
    }
  };

  useEffect(() => {
    // save current step, if user close app and reopen it
    setStep('/auth/create/step-2');
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-4 border-b border-white/10 pb-4">
        <h1 className="mb-2 text-center text-2xl font-semibold text-white">
          Set password to secure your key
        </h1>
        <p className="text-white/70">
          Password is not related to your Nostr account. It is only used to secure your
          keys stored on your local machine and to unlock the app (like unlocking your
          phone with a passcode). When you move to other Nostr clients, you just need to
          copy your private key.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                {...register('password', { required: true })}
                type={passwordInput}
                placeholder="Enter password"
                className="relative h-12 w-full rounded-lg border-t border-white/10 bg-white/20 px-3.5 py-1 text-center tracking-widest text-white !outline-none backdrop-blur-xl placeholder:tracking-normal placeholder:text-white/70"
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
            <span className="text-sm text-red-400">
              {errors.password && <p>{errors.password.message}</p>}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-12 w-full items-center justify-between gap-2 rounded-lg border-t border-white/10 bg-blue-500 px-6 font-medium leading-none text-white hover:bg-blue-600 focus:outline-none"
            >
              {loading ? (
                <>
                  <span className="w-5" />
                  <span>Securing your account...</span>
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
