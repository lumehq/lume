import { RelayContext } from '@components/relaysProvider';

import { dateToUnix } from '@utils/getDate';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import useLocalStorage from '@rehooks/local-storage';
import { getEventHash, signEvent } from 'nostr-tools';
import { useCallback, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

export const CreateChannelModal = () => {
  const [pool, relays]: any = useContext(RelayContext);
  const [open, setOpen] = useState(false);

  const [activeAccount]: any = useLocalStorage('activeAccount', {});

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm();

  const insertChannelToDB = useCallback(async (id, data, account) => {
    const { createChannel } = await import('@utils/bindings');
    return await createChannel({ event_id: id, content: data, account_id: account });
  }, []);

  const onSubmit = (data) => {
    const event: any = {
      content: JSON.stringify(data),
      created_at: dateToUnix(),
      kind: 40,
      pubkey: activeAccount.pubkey,
      tags: [],
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, activeAccount.privkey);

    // publish channel
    pool.publish(event, relays);
    // save to database
    insertChannelToDB(event.id, data, activeAccount.id);
    // close modal
    setOpen(false);
    // reset form
    reset();
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="group inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-950">
          <div className="inline-flex h-5 w-5 shrink items-center justify-center rounded bg-zinc-900">
            <PlusIcon className="h-3 w-3 text-zinc-500" />
          </div>
          <div>
            <h5 className="text-sm font-medium text-zinc-500 group-hover:text-zinc-400">Add a new channel</h5>
          </div>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <div className="relative flex h-min w-full max-w-xl flex-col rounded-lg shadow-modal">
              <div className="sticky left-0 top-0 flex h-12 w-full shrink-0 items-center justify-between rounded-t-lg bg-zinc-950 px-3">
                <div className="flex w-full items-center justify-between">
                  <h5 className="font-medium leading-none text-zinc-500"># Create channel</h5>
                  <Dialog.Close asChild>
                    <button
                      autoFocus={false}
                      className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
                    >
                      <Cross1Icon className="h-3 w-3 text-zinc-300" />
                    </button>
                  </Dialog.Close>
                </div>
              </div>
              <div className="flex h-full w-full flex-col overflow-y-auto rounded-b-lg bg-zinc-950 px-3 pb-3">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex h-full w-full flex-col gap-4 rounded-lg border border-white/20 bg-zinc-900 p-4"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Channel name *
                    </label>
                    <div className="relative w-full shrink-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-2 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20">
                      <input
                        type={'text'}
                        {...register('name', { required: true })}
                        spellCheck={false}
                        className="relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Picture</label>
                    <div className="relative w-full shrink-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-2 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20">
                      <input
                        type={'text'}
                        {...register('picture')}
                        spellCheck={false}
                        className="relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">About</label>
                    <div className="relative h-20 w-full shrink-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-2 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20">
                      <textarea
                        {...register('about')}
                        spellCheck={false}
                        className="relative h-20 w-full resize-none rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={!isDirty || !isValid}
                      className="h-11 w-full transform rounded-lg bg-fuchsia-500 font-medium text-white active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
