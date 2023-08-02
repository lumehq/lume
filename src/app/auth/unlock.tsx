import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

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
  const setPrivkey = useStronghold((state) => state.setPrivkey);

  const [passwordInput, setPasswordInput] = useState('password');
  const [loading, setLoading] = useState(false);

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
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white">Enter password to unlock</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                {...register('password', { required: true })}
                type={passwordInput}
                className="relative h-12 w-full rounded-lg bg-white/10 py-1 text-center text-white !outline-none placeholder:text-white/10"
              />
              <button
                type="button"
                onClick={() => showPassword()}
                className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-white/10"
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
