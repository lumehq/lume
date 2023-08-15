import { useQueryClient } from '@tanstack/react-query';
import { appConfigDir } from '@tauri-apps/api/path';
import { Stronghold } from '@tauri-apps/plugin-stronghold';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { removePrivkey } from '@libs/storage';
import { useStorage } from '@libs/storage/provider';

import { EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';

import { useStronghold } from '@stores/stronghold';

import { useAccount } from '@utils/hooks/useAccount';

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
  const setPrivkey = useStronghold((state) => state.setPrivkey);

  const [passwordInput, setPasswordInput] = useState('password');
  const [loading, setLoading] = useState(false);

  const { account } = useAccount();
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
      // load private in secure storage
      try {
        // save privkey to secure storage
        const dir = await appConfigDir();
        const stronghold = await Stronghold.load(`${dir}/lume.stronghold`, data.password);

        if (!db.secureDB) db.secureDB = stronghold;
        await db.secureSave(account.pubkey, account.privkey);

        // add privkey to state
        setPrivkey(account.privkey);
        // remove privkey in db
        await removePrivkey();
        // clear cache
        await queryClient.invalidateQueries(['account']);
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
          <h1 className="text-xl font-semibold text-white">
            Upgrade security for your account
          </h1>
        </div>
        <div className="w-full rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 py-3">
          <div className="flex flex-col gap-4">
            <div>
              <div className="mt-1">
                <p className="text-sm text-white/50">
                  You&apos;re using old Lume version which store your private key as
                  plaintext in database, this is huge security risk.
                </p>
                <p className="mt-2 text-sm text-white/50">
                  To secure your private key, please set a password and Lume will put your
                  private key in secure storage.
                </p>
                <p className="mt-2 text-sm text-white/50">
                  It is not possible to start the app without applying this step, it is
                  easy and fast!
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mb-0">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-zinc-200">
                  Set a password to protect your key
                </span>
                <div className="relative">
                  <input
                    {...register('password', { required: true })}
                    type={passwordInput}
                    placeholder="min. 4 characters"
                    className="relative w-full rounded-lg bg-zinc-800 py-3 pl-3.5 pr-11 text-white !outline-none placeholder:text-white/50"
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
                        className="text-white/50 group-hover:text-white"
                      />
                    ) : (
                      <EyeOnIcon
                        width={20}
                        height={20}
                        className="text-white/50 group-hover:text-white"
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
                  className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-md bg-fuchsia-500 font-medium text-white hover:bg-fuchsia-600 disabled:pointer-events-none disabled:opacity-50"
                >
                  {loading ? (
                    <LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-white" />
                  ) : (
                    'Continue →'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
