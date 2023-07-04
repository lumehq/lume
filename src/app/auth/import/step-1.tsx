import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getPublicKey, nip19 } from 'nostr-tools';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { createAccount } from '@libs/storage';

import { LoaderIcon } from '@shared/icons';

type FormValues = {
  key: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.key ? values : {},
    errors: !values.key
      ? {
          key: {
            type: 'required',
            message: 'This is required.',
          },
        }
      : {},
  };
};

export function ImportStep1Screen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);

  const account = useMutation({
    mutationFn: (data: any) => {
      return createAccount(data.npub, data.pubkey, data.privkey, null, 1);
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(['currentAccount'], data);
    },
  });

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ resolver });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      let privkey = data['key'];
      if (privkey.substring(0, 4) === 'nsec') {
        privkey = nip19.decode(privkey).data;
      }

      if (typeof getPublicKey(privkey) === 'string') {
        const pubkey = getPublicKey(privkey);
        const npub = nip19.npubEncode(pubkey);

        // update
        account.mutate({
          npub,
          pubkey,
          privkey,
          follows: null,
          is_active: 1,
        });

        // redirect to step 2
        setTimeout(() => navigate('/auth/import/step-2', { replace: true }), 1200);
      }
    } catch (error) {
      setError('key', {
        type: 'custom',
        message: 'Private Key is invalid, please check again',
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-zinc-100">Import your key</h1>
      </div>
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <input
              {...register('key', { required: true, minLength: 32 })}
              type={'password'}
              placeholder="Paste private key here..."
              className="relative w-full rounded-lg bg-zinc-800 px-3 py-3 text-zinc-100 !outline-none placeholder:text-zinc-500"
            />
            <span className="text-base text-red-400">
              {errors.key && <p>{errors.key.message}</p>}
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
  );
}
