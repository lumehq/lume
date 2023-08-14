import { appConfigDir } from '@tauri-apps/api/path';
import { Stronghold } from '@tauri-apps/plugin-stronghold';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

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

export function UnlockScreen() {
  const navigate = useNavigate();
  const setPrivkey = useStronghold((state) => state.setPrivkey);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { account } = useAccount();
  const { db } = useStorage();

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
        const dir = await appConfigDir();
        const stronghold = await Stronghold.load(`${dir}/lume.stronghold`, data.password);

        db.secureDB = stronghold;

        const privkey = await db.secureLoad(account.pubkey);

        setPrivkey(privkey);
        // redirect to home
        navigate('/', { replace: true });
      } catch (e) {
        setError('password', {
          type: 'custom',
          message: e,
        });
      }
    } else {
      setError('password', {
        type: 'custom',
        message: 'Password is required and must be greater than 3',
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white">Enter password to unlock</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-0 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                {...register('password', { required: true })}
                type={showPassword ? 'text' : 'password'}
                className="relative h-12 w-full rounded-lg bg-white/10 py-1 text-center text-white !outline-none placeholder:text-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-white/10"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-white/50 group-hover:text-white" />
                ) : (
                  <EyeOnIcon className="h-5 w-5 text-white/50 group-hover:text-white" />
                )}
              </button>
            </div>
            <span className="text-sm text-red-400">
              {errors.password && <p>{errors.password.message}</p>}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-fuchsia-500 font-medium text-white hover:bg-fuchsia-600"
            >
              {loading ? (
                <LoaderIcon className="h-4 w-4 animate-spin text-white" />
              ) : (
                'Continue →'
              )}
            </button>
            <Link
              to="/auth/reset"
              className="inline-flex h-14 items-center justify-center text-center text-white/50"
            >
              Reset password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
