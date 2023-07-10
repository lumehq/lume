import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';

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

export function UnlockScreen() {
  const navigate = useNavigate();

  const [passwordInput, setPasswordInput] = useState('password');
  const [loading, setLoading] = useState(false);
  const [setPrivkey, setPassword] = useStronghold((state) => [
    state.setPrivkey,
    state.setPassword,
  ]);

  const { account } = useAccount();
  const { load } = useSecureStorage();

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
      // add password to local state
      setPassword(data.password);

      // load private in secure storage
      try {
        const privkey = await load(account.pubkey, data.password);
        setPrivkey(privkey);
        // redirect to home
        navigate('/', { replace: true });
      } catch {
        setLoading(false);
        setError('password', {
          type: 'custom',
          message: 'Wrong password',
        });
      }
    } else {
      setLoading(false);
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
            Enter password to unlock
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  {...register('password', { required: true })}
                  type={passwordInput}
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
              <button
                type="submit"
                disabled={!isDirty || !isValid}
                className="inline-flex h-11 w-full items-center justify-center rounded-md bg-fuchsia-500 font-medium text-zinc-100 hover:bg-fuchsia-600"
              >
                {loading ? (
                  <LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
                ) : (
                  'Continue →'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}