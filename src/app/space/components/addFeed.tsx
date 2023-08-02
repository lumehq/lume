import { Dialog, Transition } from '@headlessui/react';
import { Combobox } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';

import { User } from '@app/auth/components/user';

import { createBlock } from '@libs/storage';

import { CancelIcon, CheckCircleIcon, CommandIcon, LoaderIcon } from '@shared/icons';

import { BLOCK_KINDS, DEFAULT_AVATAR } from '@stores/constants';
import { ADD_FEEDBLOCK_SHORTCUT } from '@stores/shortcuts';

import { useAccount } from '@utils/hooks/useAccount';

export function AddFeedBlock() {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');

  const { status, account } = useAccount();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useHotkeys(ADD_FEEDBLOCK_SHORTCUT, () => openModal());

  const block = useMutation({
    mutationFn: (data: { kind: number; title: string; content: string }) => {
      return createBlock(data.kind, data.title, data.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocks'] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm();

  const onSubmit = (data: { kind: number; title: string; content: string }) => {
    setLoading(true);

    selected.forEach((item, index) => {
      if (item.substring(0, 4) === 'npub') {
        selected[index] = nip19.decode(item).data;
      }
    });

    // insert to database
    block.mutate({
      kind: BLOCK_KINDS.feed,
      title: data.title,
      content: JSON.stringify(selected),
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
          <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10">
            <CommandIcon width={12} height={12} className="text-white" />
          </div>
          <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10">
            <span className="text-sm leading-none text-white">F</span>
          </div>
        </div>
        <div>
          <h5 className="font-medium text-white/50">New feed block</h5>
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
                        Create feed block
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
                      Specific newsfeed space for people you want to keep up to date
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
                        Title *
                      </label>
                      <input
                        type={'text'}
                        {...register('title', {
                          required: true,
                        })}
                        spellCheck={false}
                        className="relative h-10 w-full rounded-md bg-zinc-800 px-3 py-2 text-zinc-100 !outline-none placeholder:text-zinc-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">
                        Choose at least 1 user *
                      </span>
                      <div className="flex h-[300px] w-full flex-col overflow-y-auto overflow-x-hidden rounded-lg border-t border-zinc-700/50 bg-zinc-800">
                        <div className="w-full px-3 py-2">
                          <Combobox value={selected} onChange={setSelected} multiple>
                            <Combobox.Input
                              onChange={(event) => setQuery(event.target.value)}
                              spellCheck={false}
                              placeholder="Enter pubkey or npub..."
                              className="relative mb-2 h-10 w-full rounded-md bg-zinc-700 px-3 py-2 text-zinc-100 !outline-none placeholder:text-zinc-500"
                            />
                            <Combobox.Options static>
                              {query.length > 0 && (
                                <Combobox.Option
                                  value={query}
                                  className="group flex w-full items-center justify-between rounded-md px-2 py-2 hover:bg-zinc-700"
                                >
                                  {({ selected }) => (
                                    <>
                                      <div className="flex items-center gap-2">
                                        <img
                                          alt={query}
                                          src={DEFAULT_AVATAR}
                                          className="h-11 w-11 shrink-0 rounded object-cover"
                                        />
                                        <div className="inline-flex flex-col gap-1">
                                          <span className="text-base leading-tight text-zinc-400">
                                            {query}
                                          </span>
                                        </div>
                                      </div>
                                      {selected && (
                                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              )}
                              {status === 'loading' ? (
                                <p>Loading...</p>
                              ) : (
                                JSON.parse(account.follows as string).map((follow) => (
                                  <Combobox.Option
                                    key={follow}
                                    value={follow}
                                    className="group flex w-full items-center justify-between rounded-md px-2 py-2 hover:bg-zinc-700"
                                  >
                                    {({ selected }) => (
                                      <>
                                        <User pubkey={follow} />
                                        {selected && (
                                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                        )}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))
                              )}
                            </Combobox.Options>
                          </Combobox>
                        </div>
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
