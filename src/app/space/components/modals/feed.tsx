import { Combobox } from '@headlessui/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';

import { User } from '@app/auth/components/user';

import { createBlock } from '@libs/storage';

import { CancelIcon, CheckCircleIcon, CommandIcon, LoaderIcon } from '@shared/icons';

import { BLOCK_KINDS, DEFAULT_AVATAR } from '@stores/constants';
import { ADD_FEEDBLOCK_SHORTCUT } from '@stores/shortcuts';

import { useAccount } from '@utils/hooks/useAccount';

export function FeedModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');

  const { status, account } = useAccount();

  useHotkeys(ADD_FEEDBLOCK_SHORTCUT, () => setOpen(true));

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
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-9 w-72 items-center justify-start gap-2.5 rounded-md px-2.5"
        >
          <div className="flex items-center gap-2">
            <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10">
              <CommandIcon className="h-3 w-3 text-white" />
            </div>
            <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/10">
              <span className="text-sm leading-none text-white">F</span>
            </div>
          </div>
          <h5 className="font-medium text-white/50">New feed block</h5>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal className="relative z-10">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-white/10">
            <div className="h-min w-full shrink-0 border-b border-white/10 bg-white/5 px-5 py-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold leading-none text-white">
                    Create feed block
                  </Dialog.Title>
                  <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/10">
                    <CancelIcon className="h-4 w-4 text-white/50" />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="text-sm leading-tight text-white/50">
                  Specific newsfeed space for people you want to keep up to date
                </Dialog.Description>
              </div>
            </div>
            <div className="flex flex-col overflow-y-auto overflow-x-hidden px-5 pb-5 pt-2">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mb-0 flex h-full w-full flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium uppercase tracking-wider text-white/50"
                  >
                    Title *
                  </label>
                  <input
                    type={'text'}
                    {...register('title', {
                      required: true,
                    })}
                    spellCheck={false}
                    className="relative h-11 w-full rounded-lg bg-white/10 px-3 py-2 text-white !outline-none placeholder:text-white/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium uppercase tracking-wider text-white/50">
                    Choose at least 1 user *
                  </span>
                  <div className="flex h-[300px] w-full flex-col overflow-y-auto overflow-x-hidden rounded-lg bg-white/10">
                    <div className="w-full px-3 py-2">
                      <Combobox value={selected} onChange={setSelected} multiple>
                        <Combobox.Input
                          onChange={(event) => setQuery(event.target.value)}
                          spellCheck={false}
                          placeholder="Enter pubkey or npub..."
                          className="relative mb-2 h-10 w-full rounded-md bg-white/10 px-3 py-2 text-white !outline-none placeholder:text-white/50"
                        />
                        <Combobox.Options static>
                          {query.length > 0 && (
                            <Combobox.Option
                              value={query}
                              className="group flex w-full items-center justify-between rounded-md px-2 py-2 hover:bg-white/10"
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
                                      <span className="text-base leading-tight text-white/50">
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
                            account?.follows?.map((follow) => (
                              <Combobox.Option
                                key={follow}
                                value={follow}
                                className="group flex w-full items-center justify-between rounded-md px-2 py-2 hover:bg-white/10"
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
                <button
                  type="submit"
                  disabled={!isDirty || !isValid}
                  className="shadow-button inline-flex h-11 w-full transform items-center justify-center rounded-lg bg-fuchsia-500 font-medium text-white active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {loading ? (
                    <LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-white" />
                  ) : (
                    'Confirm'
                  )}
                </button>
              </form>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
