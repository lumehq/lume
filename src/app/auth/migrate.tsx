import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { removePrivkey } from '@libs/storage';

import { CheckCircleIcon, EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';

import { useStronghold } from '@stores/stronghold';

import { useAccount } from '@utils/hooks/useAccount';
import { useSecureStorage } from '@utils/hooks/useSecureStorage';

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

export function MigrateScreen() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [passwordInput, setPasswordInput] = useState('password');
  const [passwordStep, setPasswordStep] = useState({ loading: false, done: false });
  const [privkeyStep, setPrivkeyStep] = useState({ loading: false, done: false });

  const { account } = useAccount();
  const { save } = useSecureStorage();

  const setPassword = useStronghold((state) => state.setPassword);

  // toggle private key
  const showPassword = () => {
    if (passwordInput === 'password') {
      setPasswordInput('text');
    } else {
      setPasswordInput('password');
    }
  };

  const clearPrivkey = async () => {
    setPrivkeyStep((prev) => ({ ...prev, loading: true }));
    const res = await removePrivkey();
    if (res) {
      setPrivkeyStep({ done: true, loading: false });
    } else {
      setPrivkeyStep((prev) => ({ ...prev, loading: false }));
    }
  };

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ resolver });

  const onSubmit = async (data: { [x: string]: string }) => {
    setPasswordStep((prev) => ({ ...prev, loading: true }));
    if (data.password.length > 3) {
      // add password to local state
      setPassword(data.password);

      // load private in secure storage
      try {
        await save(account.pubkey, account.privkey, data.password);
        // clear cache
        await queryClient.invalidateQueries(['currentAccount']);
        // redirect to home
        navigate('/', { replace: true });
      } catch {
        setPasswordStep((prev) => ({ ...prev, loading: false }));
        setError('password', {
          type: 'custom',
          message: 'Wrong password',
        });
      }
    } else {
      setPasswordStep((prev) => ({ ...prev, loading: false }));
      setError('password', {
        type: 'custom',
        message: 'Password is required and must be greater than 3',
      });
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-zinc-100">
            Upgrade security for your account
          </h1>
        </div>
        <div className="w-full rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 py-3">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-medium text-zinc-200">
                Remove plaintext privkey store in local database
              </h3>
              <div className="mt-1">
                <p className="text-sm text-zinc-400">
                  You&apos;re using old Lume version which store your private key as
                  plaintext in database, this is huge security risk.
                </p>
                <p className="mt-2 text-sm text-zinc-400">To secure your private key</p>
                <ul className="mt-2 list-outside list-disc pl-5 text-sm text-zinc-400">
                  <li>Firstly, click button below to remove it from local database</li>
                  <li>
                    Then set password and Lume will put your private key in secure storage
                  </li>
                </ul>
              </div>
              <div className="mt-3">
                <div className="relative">
                  <input
                    readOnly
                    value={privkeyStep.done ? 'Nothing to see here' : account.privkey}
                    className="relative w-full rounded-lg bg-zinc-800 px-3 py-3 text-zinc-100 !outline-none placeholder:text-zinc-500"
                  />
                  <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg bg-black/10 backdrop-blur-sm">
                    {privkeyStep.done ? (
                      privkeyStep.loading ? (
                        <LoaderIcon className="h-4 w-4 animate-spin text-zinc-100" />
                      ) : (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => clearPrivkey()}
                        className="inline-flex w-max items-center justify-center rounded bg-fuchsia-500 px-2.5 py-1.5 text-sm hover:bg-fuchsia-600"
                      >
                        Click to remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mb-0">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-zinc-200">
                  Set password to protect your key
                </span>
                <div className="relative">
                  <input
                    {...register('password', { required: true })}
                    type={passwordInput}
                    placeholder="min. 4 characters"
                    className="relative w-full rounded-lg bg-zinc-800 py-3 pl-3.5 pr-11 text-zinc-100 !outline-none placeholder:text-zinc-400"
                  />
                  <button
                    type="button"
                    onClick={() => showPassword()}
                    className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-zinc-700"
                  >
                    {passwordInput === 'password' ? (
                      <EyeOffIcon
                        width={20}
                        height={20}
                        className="text-zinc-500 group-hover:text-zinc-100"
                      />
                    ) : (
                      <EyeOnIcon
                        width={20}
                        height={20}
                        className="text-zinc-500 group-hover:text-zinc-100"
                      />
                    )}
                  </button>
                </div>
                <span className="text-sm text-red-400">
                  {errors.password && <p>{errors.password.message}</p>}
                </span>
              </div>
              <div className="flex items-center justify-center">
                {privkeyStep.done && (
                  <button
                    type="submit"
                    disabled={!isDirty || !isValid}
                    className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-md bg-fuchsia-500 font-medium text-zinc-100 hover:bg-fuchsia-600 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {passwordStep.loading ? (
                      <LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
                    ) : (
                      'Continue →'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
