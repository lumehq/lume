import * as Dialog from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';

import { createBlock } from '@libs/storage';

import { CancelIcon, CommandIcon, LoaderIcon } from '@shared/icons';

import { BLOCK_KINDS } from '@stores/constants';
import { ADD_HASHTAGBLOCK_SHORTCUT } from '@stores/shortcuts';

export function HashtagModal() {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useHotkeys(ADD_HASHTAGBLOCK_SHORTCUT, () => setOpen(false));

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
              <span className="text-sm leading-none text-white">T</span>
            </div>
          </div>
          <h5 className="font-medium text-white/50">New hashtag block</h5>
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
                    Create hashtag block
                  </Dialog.Title>
                  <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/10">
                    <CancelIcon className="h-4 w-4 text-white/50" />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="text-sm leading-tight text-white/50">
                  Pin the hashtag you want to keep follow up
                </Dialog.Description>
              </div>
            </div>
            <div className="flex h-full w-full flex-col overflow-y-auto px-5 pb-5 pt-3">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mb-0 flex h-full w-full flex-col gap-3"
              >
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium uppercase tracking-wider text-white/50"
                  >
                    Hashtag *
                  </label>
                  <input
                    type={'text'}
                    {...register('hashtag', {
                      required: true,
                    })}
                    spellCheck={false}
                    placeholder="#"
                    className="relative h-11 w-full rounded-lg bg-white/10 px-3 py-2 text-white !outline-none placeholder:text-white/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!isDirty || !isValid}
                  className="inline-flex h-11 w-full transform items-center justify-center rounded-lg bg-fuchsia-500 font-medium text-white active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {loading ? (
                    <LoaderIcon className="h-4 w-4 animate-spin text-white" />
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
