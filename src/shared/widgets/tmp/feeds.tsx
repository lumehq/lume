import { useState } from 'react';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, CheckCircleIcon } from '@shared/icons';
import { User } from '@shared/user';

import { WidgetKinds, useWidgets } from '@stores/widgets';

import { Widget } from '@utils/types';

export function XfeedsWidget({ params }: { params: Widget }) {
  const { db } = useStorage();

  const [setWidget, removeWidget] = useWidgets((state) => [
    state.setWidget,
    state.removeWidget,
  ]);
  const [title, setTitle] = useState<string>('');
  const [groups, setGroups] = useState<Array<string>>([]);

  // toggle follow state
  const toggleGroup = (pubkey: string) => {
    const arr = groups.includes(pubkey)
      ? groups.filter((i) => i !== pubkey)
      : [...groups, pubkey];
    setGroups(arr);
  };

  const cancel = () => {
    removeWidget(db, params.id);
  };

  const submit = async () => {
    setWidget(db, {
      kind: WidgetKinds.local.feeds,
      title: title || 'Group',
      content: JSON.stringify(groups),
    });
    // remove temp widget
    removeWidget(db, params.id);
  };

  return (
    <div className="flex h-full shrink-0 grow-0 basis-[400px] flex-col items-center justify-center">
      <div className="w-full px-5">
        <h3 className="mb-4 text-center font-semibold text-zinc-900 dark:text-zinc-100">
          Choose account you want to add to group feeds
        </h3>
        <div className="mb-0 flex flex-col gap-2">
          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="relative h-11 w-full rounded-lg bg-zinc-200 px-3 py-1 text-zinc-900 !outline-none placeholder:text-zinc-500 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-300"
            />
          </div>
          <div className="scrollbar-hide flex h-[500px] w-full flex-col overflow-y-auto rounded-lg bg-zinc-200 py-2 dark:bg-zinc-800">
            {db.account.network.map((item: string) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleGroup(item)}
                className="inline-flex transform items-center justify-between px-4 py-2 hover:bg-zinc-300 dark:hover:bg-zinc-700"
              >
                <User pubkey={item} variant="simple" />
                {groups.includes(item) && (
                  <div>
                    <CheckCircleIcon className="h-4 w-4 text-green-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <button
              type="submit"
              disabled={groups.length < 1}
              onClick={submit}
              className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-interor-500 px-6 font-medium leading-none text-white hover:bg-interor-600 focus:outline-none disabled:opacity-50"
            >
              <span className="w-5" />
              <span>Add {groups.length} account to group feed</span>
              <ArrowRightCircleIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={cancel}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-6 font-medium leading-none text-zinc-900 hover:bg-zinc-200 focus:outline-none disabled:opacity-50 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
