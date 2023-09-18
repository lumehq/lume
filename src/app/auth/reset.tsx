import { appConfigDir } from '@tauri-apps/api/path';
import { getPublicKey, nip19 } from 'nostr-tools';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Stronghold } from 'tauri-plugin-stronghold-api';

import { useStorage } from '@libs/storage/provider';

import { EyeOffIcon, EyeOnIcon, LoaderIcon } from '@shared/icons';

import { useStronghold } from '@stores/stronghold';

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
      try {
        let privkey = data.privkey;
        if (privkey.startsWith('nsec')) {
          privkey = nip19.decode(privkey).data as string;
        }

        const tmpPubkey = getPublicKey(privkey);

        if (tmpPubkey !== db.account.pubkey) {
          setLoading(false);
          setError('password', {
            type: 'custom',
            message:
              "Private key don't match current account store in database, please check again",
          });
        } else {
          // remove old stronghold
          await db.secureReset();

          // save privkey to secure storage
          const dir = await appConfigDir();
          const stronghold = await Stronghold.load(
            `${dir}/lume.stronghold`,
            data.password
          );

          if (!db.secureDB) db.secureDB = stronghold;
          await db.secureSave(db.account.pubkey, db.account.privkey);

          // add privkey to state
          setPrivkey(db.account.privkey);
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
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white">Reset unlock password</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-0 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="privkey" className="font-medium text-white">
              Private key
            </label>
            <div className="relative">
              <input
                {...register('privkey', { required: true })}
                type="text"
                placeholder="nsec1..."
                className="relative h-12 w-full rounded-lg border-t border-white/10 bg-white/20 px-3.5 py-1 text-white !outline-none backdrop-blur-xl placeholder:text-white/70"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium text-white">
              Set a new password to protect your key
            </label>
            <div className="relative">
              <input
                {...register('password', { required: true })}
                type={passwordInput}
                placeholder="Min. 4 characters"
                className="relative h-12 w-full rounded-lg border-t border-white/10 bg-white/20 px-3.5 py-1 text-white !outline-none backdrop-blur-xl placeholder:text-white/70"
              />
              <button
                type="button"
                onClick={() => showPassword()}
                className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 backdrop-blur-xl hover:bg-white/10"
              >
                {passwordInput === 'password' ? (
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
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-fuchsia-500 font-medium text-white hover:bg-fuchsia-600 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <LoaderIcon className="h-4 w-4 animate-spin text-white" />
              ) : (
                'Continue →'
              )}
            </button>
            <Link
              to="/auth/unlock"
              className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-lg text-center text-white/70 hover:bg-white/20"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
