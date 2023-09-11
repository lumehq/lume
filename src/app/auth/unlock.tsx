import { appConfigDir } from '@tauri-apps/api/path';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Stronghold } from 'tauri-plugin-stronghold-api';

import { User } from '@app/auth/components/user';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';

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
      const uri = await db.secureLoad('walletConnectURL', 'alby');

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

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white">Enter password to unlock</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-0 flex flex-col">
          <div className="flex flex-col rounded-lg bg-white/5">
            <div className="w-full rounded-t-lg border-b border-white/10 bg-white/5 p-4">
              <User pubkey={db.account.pubkey} />
            </div>
            <div className="relative">
              <input
                {...register('password', { required: true, minLength: 4 })}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="relative h-12 w-full rounded-b-lg bg-white/10 py-1 text-center text-white !outline-none backdrop-blur-xl placeholder:text-white/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 backdrop-blur-xl hover:bg-white/10"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-white/50 group-hover:text-white" />
                ) : (
                  <EyeOnIcon className="h-5 w-5 text-white/50 group-hover:text-white" />
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="mb-3 text-sm text-red-400">
              {errors.password && <p>{errors.password.message}</p>}
            </span>
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-5" />
                  <span>Decryting...</span>
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
            <Link
              to="/auth/reset"
              className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-lg text-center text-white/50 hover:bg-white/10"
            >
              Reset password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
