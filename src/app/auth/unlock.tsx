import { appConfigDir } from '@tauri-apps/api/path';
import { Stronghold } from '@tauri-apps/plugin-stronghold';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';
import { User } from '@shared/user';

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

export function UnlockScreen() {
  const navigate = useNavigate();
  const setPrivkey = useStronghold((state) => state.setPrivkey);
  const setWalletConnectURL = useStronghold((state) => state.setWalletConnectURL);
  const resetStronghold = useStronghold((state) => state.reset);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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

      const dir = await appConfigDir();
      const stronghold = await Stronghold.load(`${dir}/lume.stronghold`, data.password);

      if (!db.secureDB) db.secureDB = stronghold;

      const privkey = await db.secureLoad(db.account.pubkey);
      const uri = await db.secureLoad('walletConnectURL', 'nwc');

      if (privkey) setPrivkey(privkey);
      if (uri) setWalletConnectURL(uri);
      // redirect to home
      navigate('/', { replace: true });
    } catch (e) {
      setLoading(false);
      setError('password', {
        type: 'custom',
        message: e,
      });
    }
  };

  const logout = async () => {
    // remove account
    db.accountLogout();
    // reset stronghold
    resetStronghold();
    // redirect to welcome screen
    navigate('/auth/welcome');
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 inline-flex w-full items-center justify-center">
          <User pubkey={db.account.pubkey} variant="avatar" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-0 flex w-2/3 flex-col"
        >
          <div className="relative">
            <input
              {...register('password', { required: true, minLength: 4 })}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              className="relative h-12 w-full rounded-lg bg-zinc-300 py-1 text-center tracking-widest text-zinc-900 !outline-none backdrop-blur-xl placeholder:tracking-normal placeholder:text-zinc-500 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded-lg p-1 backdrop-blur-xl hover:bg-black/10 dark:hover:bg-white/10"
            >
              {showPassword ? (
                <EyeOffIcon className="group-hover:text-dark h-5 w-5 text-black/50 dark:text-white/50 dark:group-hover:text-white" />
              ) : (
                <EyeOnIcon className="group-hover:text-dark h-5 w-5 text-black/50 dark:text-white/50 dark:group-hover:text-white" />
              )}
            </button>
          </div>
          <div className="mt-2 flex flex-col">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-10 w-full items-center justify-between gap-2 rounded-lg bg-interor-600 px-6 text-white hover:bg-interor-700 focus:outline-none disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-5" />
                  <span>Unlocking...</span>
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
