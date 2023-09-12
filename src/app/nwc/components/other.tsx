import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, CancelIcon, LoaderIcon, WorldIcon } from '@shared/icons';

import { useStronghold } from '@stores/stronghold';

type FormValues = {
  uri: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.uri ? values : {},
    errors: !values.uri
      ? {
          uri: {
            type: 'required',
            message: 'This is required.',
          },
        }
      : {},
  };
};

export function NWCOther() {
  const { db } = useStorage();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ resolver });

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const setWalletConnectURL = useStronghold((state) => state.setWalletConnectURL);

  const onSubmit = async (data: { [x: string]: string }) => {
    try {
      if (!data.uri.startsWith('nostr+walletconnect:')) {
        setError('uri', {
          type: 'custom',
          message:
            'Connect URI is required and must start with format nostr+walletconnect:, please check again',
        });
        return;
      }

      setIsloading(true);

      const uriObj = new URL(data.uri);
      const params = new URLSearchParams(uriObj.search);

      if (params.has('relay') && params.has('secret')) {
        await db.secureSave('walletConnectURL', data.uri, 'alby');
        setWalletConnectURL(data.uri);
        setIsloading(false);
      }
    } catch (e) {
      setIsloading(false);
      setError('uri', {
        type: 'custom',
        message:
          'Connect URI is required and must start with format nostr+walletconnect:, please check again',
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between pt-3">
        <div className="inline-flex items-center gap-2">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-white/10">
            <WorldIcon className="h-5 w-5" />
          </div>
          <div>
            <h5 className="font-semibold leading-tight text-white">URI String</h5>
            <p className="text-sm leading-tight text-white/50">
              Using format nostr+walletconnect://
            </p>
          </div>
        </div>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="inline-flex h-8 w-min items-center justify-center rounded-md bg-white/10 px-2.5 text-sm font-medium text-white hover:bg-white/20"
          >
            Connect
          </button>
        </Dialog.Trigger>
      </div>
      <Dialog.Portal className="relative z-10">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-white/10 backdrop-blur-xl">
            <div className="h-min w-full shrink-0 rounded-t-xl border-b border-white/10 bg-white/5 px-5 py-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold leading-none text-white">
                    Nostr Wallet Connect
                  </Dialog.Title>
                  <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md backdrop-blur-xl hover:bg-white/10">
                    <CancelIcon className="h-4 w-4 text-white/50" />
                  </Dialog.Close>
                </div>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mb-0 flex flex-col gap-3 px-5 py-5"
            >
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="uri"
                  className="text-sm font-semibold uppercase tracking-wider text-white/50"
                >
                  Connect URI
                </label>
                <input
                  {...register('uri', { required: true })}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  className="relative h-11 w-full rounded-lg bg-white/10 px-3 py-1 text-white !outline-none backdrop-blur-xl placeholder:text-white/50"
                />
                <span className="text-sm text-red-400">
                  {errors.uri && <p>{errors.uri.message}</p>}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-center">
                <button
                  type="submit"
                  disabled={!isDirty || !isValid}
                  className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="w-5" />
                      <span>Connecting...</span>
                      <LoaderIcon className="h-5 w-5 animate-spin text-white" />
                    </>
                  ) : (
                    <>
                      <span className="w-5" />
                      <span>Connect</span>
                      <ArrowRightCircleIcon className="h-5 w-5" />
                    </>
                  )}
                </button>
                <span className="text-sm text-white/50">
                  All information will be encrypted and stored on the local machine.
                </span>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
