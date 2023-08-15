import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getPublicKey, nip19 } from 'nostr-tools';
import { useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';
import { ArrowRightCircleIcon } from '@shared/icons/arrowRightCircle';

import { useOnboarding } from '@stores/onboarding';
import { useStronghold } from '@stores/stronghold';

type FormValues = {
  privkey: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.privkey ? values : {},
    errors: !values.privkey
      ? {
          privkey: {
            type: 'required',
            message: 'This is required.',
          },
        }
      : {},
  };
};

export function ImportStep1Screen() {
  const { db } = useStorage();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setPrivkey = useStronghold((state) => state.setPrivkey);
  const setTempPubkey = useOnboarding((state) => state.setTempPrivkey);
  const setPubkey = useOnboarding((state) => state.setPubkey);
  const setStep = useOnboarding((state) => state.setStep);

  const [loading, setLoading] = useState(false);

  const account = useMutation({
    mutationFn: (data: {
      npub: string;
      pubkey: string;
      follows: null | string[];
      is_active: number | boolean;
    }) => {
      return db.createAccount(data.npub, data.pubkey);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['account'], data);
    },
  });

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ resolver });

  const onSubmit = async (data: { [x: string]: string }) => {
    try {
      setLoading(true);

      let privkey = data['privkey'];
      if (privkey.substring(0, 4) === 'nsec') {
        privkey = nip19.decode(privkey).data as string;
      }

      if (typeof getPublicKey(privkey) === 'string') {
        const pubkey = getPublicKey(privkey);
        const npub = nip19.npubEncode(pubkey);

        setPrivkey(privkey);
        setTempPubkey(privkey); // only use if user close app and reopen it
        setPubkey(pubkey);

        // add account to local database
        account.mutate({
          npub,
          pubkey,
          follows: null,
          is_active: 1,
        });

        // redirect to step 2
        navigate('/auth/import/step-2', { replace: true });
      }
    } catch (error) {
      setError('privkey', {
        type: 'custom',
        message: 'Private key is invalid, please check again',
      });
    }
  };

  useEffect(() => {
    // save current step, if user close app and reopen it
    setStep('/auth/import/step-1');
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-white">Import your key</h1>
      </div>
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-0 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold text-white/50">Private key</span>
            <input
              {...register('privkey', { required: true, minLength: 32 })}
              type={'password'}
              placeholder="nsec or hexstring"
              className="relative h-11 w-full rounded-lg bg-white/10 px-3 py-1 text-white !outline-none placeholder:text-white/50"
            />
            <span className="text-sm text-red-400">
              {errors.privkey && <p>{errors.privkey.message}</p>}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none"
            >
              {loading ? (
                <>
                  <span className="w-5" />
                  <span>Creating...</span>
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
