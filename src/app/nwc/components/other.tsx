import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, CancelIcon, LoaderIcon, WorldIcon } from '@shared/icons';

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
        await db.secureSave('nwc', data.uri);
        setIsloading(false);
        setIsOpen(false);
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
      <div className="flex items-center justify-between pt-4">
        <div className="inline-flex items-center gap-2.5">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-700">
            <WorldIcon className="h-5 w-5" />
          </div>
          <div>
            <h5 className="font-semibold text-neutral-900 dark:text-neutral-100">
              URI String
            </h5>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Using format nostr+walletconnect:
            </p>
          </div>
        </div>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="inline-flex h-9 w-min items-center justify-center rounded-lg bg-neutral-300 px-3 text-sm font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-700"
          >
            Connect
          </button>
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-white dark:bg-black" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-neutral-400 dark:bg-neutral-600">
            <div className="h-min w-full shrink-0 rounded-t-xl border-b border-white/10 bg-white/5 px-5 py-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold leading-none text-white">
                    Nostr Wallet Connect
                  </Dialog.Title>
                  <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md backdrop-blur-xl hover:bg-white/10">
                    <CancelIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
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
                  className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400"
                >
                  Connect URI
                </label>
                <input
                  {...register('uri', { required: true })}
                  placeholder="nostr+walletconnect:"
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  className="relative h-11 w-full rounded-lg bg-white/10 px-3 py-1 text-white !outline-none backdrop-blur-xl placeholder:text-neutral-600 dark:text-neutral-400"
                />
                <span className="text-sm text-red-400">
                  {errors.uri && <p>{errors.uri.message}</p>}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-center">
                <button
                  type="submit"
                  disabled={!isDirty || !isValid}
                  className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-blue-500 px-6 font-medium leading-none text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
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
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
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
