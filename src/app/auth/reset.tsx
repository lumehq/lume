import { getPublicKey, nip19 } from 'nostr-tools';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';

import { useStronghold } from '@stores/stronghold';

import { useAccount } from '@utils/hooks/useAccount';
import { useSecureStorage } from '@utils/hooks/useSecureStorage';

type FormValues = {
  password: string;
  privkey: string;
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

export function ResetScreen() {
  const navigate = useNavigate();
  const setPrivkey = useStronghold((state) => state.setPrivkey);

  const [passwordInput, setPasswordInput] = useState('password');
  const [loading, setLoading] = useState(false);

  const { account } = useAccount();
  const { save, reset } = useSecureStorage();

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
      try {
        let privkey = data.privkey;
        if (privkey.startsWith('nsec')) {
          privkey = nip19.decode(privkey).data as string;
        }

        const tmpPubkey = getPublicKey(privkey);

        if (tmpPubkey !== account.pubkey) {
          setLoading(false);
          setError('password', {
            type: 'custom',
            message:
              "Private key don't match current account store in database, please check again",
          });
        } else {
          // remove old stronghold
          await reset();
          // save privkey to secure storage
          await save(account.pubkey, account.privkey, data.password);
          // add privkey to state
          setPrivkey(account.privkey);
          // redirect to home
          navigate('/auth/unlock', { replace: true });
        }
      } catch {
        setLoading(false);
        setError('password', {
          type: 'custom',
          message: 'Invalid private key',
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
          <h1 className="text-xl font-semibold text-zinc-100">Reset unlock password</h1>
        </div>
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="mb-0 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="privkey" className="font-medium text-zinc-200">
                Private key
              </label>
              <div className="relative">
                <input
                  {...register('privkey', { required: true })}
                  type="text"
                  placeholder="nsec..."
                  className="relative w-full rounded-lg bg-zinc-800 px-3.5 py-3 text-zinc-100 !outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-medium text-zinc-200">
                Set a new password to protect your key
              </label>
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
              <button
                type="submit"
                disabled={!isDirty || !isValid}
                className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-md bg-fuchsia-500 font-medium text-zinc-100 hover:bg-fuchsia-600 disabled:pointer-events-none disabled:opacity-50"
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
