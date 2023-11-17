import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';

import { useStorage } from '@libs/storage/provider';

import {
  ArrowRightCircleIcon,
  CancelIcon,
  CheckCircleIcon,
  GroupFeedsIcon,
  PlusIcon,
} from '@shared/icons';
import { User } from '@shared/user';

import { WIDGET_KIND } from '@stores/constants';

import { useWidget } from '@utils/hooks/useWidget';

export function AddGroupFeeds({ currentWidgetId }: { currentWidgetId: string }) {
  const { db } = useStorage();
  const { replaceWidget } = useWidget();

  const [title, setTitle] = useState<string>('');
  const [users, setUsers] = useState<Array<string>>([]);

  // toggle follow state
  const toggleUser = (pubkey: string) => {
    const arr = users.includes(pubkey)
      ? users.filter((i) => i !== pubkey)
      : [...users, pubkey];
    setUsers(arr);
  };

  const submit = async () => {
    replaceWidget.mutate({
      currentId: currentWidgetId,
      widget: {
        kind: WIDGET_KIND.group,
        title: title || 'Group',
        content: JSON.stringify(users),
      },
    });
  };

  return (
    <Dialog.Root>
      <div className="inline-flex h-14 w-full items-center justify-between rounded-lg bg-neutral-50 px-3 hover:shadow-md hover:shadow-neutral-200/50 dark:bg-neutral-950 dark:hover:shadow-neutral-800/50">
        <div className="inline-flex items-center gap-2.5">
          <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900">
            <GroupFeedsIcon className="h-4 w-4" />
          </div>
          <p className="font-medium">Group feeds</p>
        </div>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="inline-flex h-6 items-center gap-1 rounded-md bg-neutral-100 pl-1.5 pr-2.5 text-sm font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-900"
          >
            <PlusIcon className="h-3 w-3" />
            Add
          </button>
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm dark:bg-black/20" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-neutral-50 dark:bg-neutral-950">
            <div className="w-full shrink-0 rounded-t-xl border-b border-neutral-100 px-3 py-5 dark:border-neutral-900">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold leading-none text-neutral-900 dark:text-neutral-100">
                  Adding group feeds
                </Dialog.Title>
                <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md text-neutral-900 hover:bg-neutral-200 dark:text-neutral-100 dark:hover:bg-neutral-800">
                  <CancelIcon className="h-4 w-4" />
                </Dialog.Close>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 px-3">
              <div className="flex flex-col gap-1 pt-2">
                <label
                  htmlFor="name"
                  className="font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Name
                </label>
                <input
                  name="name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nostrichs..."
                  className="relative h-11 w-full rounded-lg bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none placeholder:text-neutral-500 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  Users
                </span>
                <div className="flex h-[420px] flex-col overflow-y-auto rounded-xl bg-neutral-100 py-2 dark:bg-neutral-900">
                  {db.account.circles.map((item: string) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleUser(item)}
                      className="inline-flex transform items-center justify-between px-3 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <User pubkey={item} variant="simple" />
                      {users.includes(item) ? (
                        <CheckCircleIcon className="h-5 w-5 text-teal-500" />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-2 px-3 py-3">
              <button
                type="submit"
                disabled={users.length < 1}
                onClick={submit}
                className="inline-flex h-9 w-full items-center justify-between gap-2 rounded-lg bg-blue-500 px-6 font-medium text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
              >
                <span className="w-5" />
                <span>Add {users.length} user to group feeds</span>
                <ArrowRightCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
