import { Dialog, Transition } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';

import { createBlock } from '@libs/storage';

import { CancelIcon, CommandIcon, LoaderIcon } from '@shared/icons';

import { BLOCK_KINDS } from '@stores/constants';
import { ADD_HASHTAGBLOCK_SHORTCUT } from '@stores/shortcuts';

export function AddHashTagBlock() {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useHotkeys(ADD_HASHTAGBLOCK_SHORTCUT, () => openModal());

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm();

  const block = useMutation({
    mutationFn: (data: { kind: number; title: string; content: string }) => {
      return createBlock(data.kind, data.title, data.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
    },
  });

  const onSubmit = async (data: { hashtag: string }) => {
    setLoading(true);

    // mutate
    block.mutate({
      kind: BLOCK_KINDS.hashtag,
      title: data.hashtag,
      content: data.hashtag.replace('#', ''),
    });

    setLoading(false);
    // reset form
    reset();
    // close modal
    closeModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => openModal()}
        className="inline-flex h-9 w-72 items-center justify-start gap-2.5 rounded-md px-2.5"
      >
        <div className="flex items-center gap-2">
          <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-800/50 bg-zinc-900">
            <CommandIcon width={12} height={12} className="text-zinc-500" />
          </div>
          <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-800/50 bg-zinc-900">
            <span className="text-sm leading-none text-zinc-500">T</span>
          </div>
        </div>
        <div>
          <h5 className="font-medium text-zinc-400">New hashtag block</h5>
        </div>
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-md" />
          </Transition.Child>
          <div className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col gap-2 rounded-xl border-t border-zinc-800/50 bg-zinc-900">
                <div className="h-min w-full shrink-0 border-b border-zinc-800 px-5 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-none text-zinc-100"
                      >
                        Create hashtag block
                      </Dialog.Title>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
                      >
                        <CancelIcon width={14} height={14} className="text-zinc-300" />
                      </button>
                    </div>
                    <Dialog.Description className="text-sm leading-tight text-zinc-400">
                      Pin the hashtag you want to keep follow up
                    </Dialog.Description>
                  </div>
                </div>
                <div className="flex h-full w-full flex-col overflow-y-auto px-5 pb-5 pt-3">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mb-0 flex h-full w-full flex-col gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="title"
                        className="text-sm font-medium uppercase tracking-wider text-zinc-400"
                      >
                        Hashtag *
                      </label>
                      <div className="after:shadow-highlight relative w-full shrink-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[6px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-2 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[6px] after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20">
                        <input
                          type={'text'}
                          {...register('hashtag', {
                            required: true,
                          })}
                          spellCheck={false}
                          placeholder="#"
                          className="shadow-input relative h-10 w-full rounded-md border border-black/5 px-3 py-2 shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-black/10 dark:placeholder:text-zinc-500"
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={!isDirty || !isValid}
                        className="shadow-button inline-flex h-11 w-full transform items-center justify-center rounded-lg bg-fuchsia-500 font-medium text-zinc-100 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        {loading ? (
                          <LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
                        ) : (
                          'Confirm'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
