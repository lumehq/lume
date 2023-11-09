import { useState } from 'react';

import { useStorage } from '@libs/storage/provider';

import { ArrowRightCircleIcon, CancelIcon, CheckCircleIcon } from '@shared/icons';
import { User } from '@shared/user';
import { WidgetWrapper } from '@shared/widgets';

import { WIDGET_KIND } from '@stores/constants';

import { useWidget } from '@utils/hooks/useWidget';
import { Widget } from '@utils/types';

export function XfeedsWidget({ params }: { params: Widget }) {
  const { db } = useStorage();
  const { addWidget, removeWidget } = useWidget();

  const [title, setTitle] = useState<string>('');
  const [groups, setGroups] = useState<Array<string>>([]);

  // toggle follow state
  const toggleGroup = (pubkey: string) => {
    const arr = groups.includes(pubkey)
      ? groups.filter((i) => i !== pubkey)
      : [...groups, pubkey];
    setGroups(arr);
  };

  const submit = async () => {
    addWidget.mutate({
      kind: WIDGET_KIND.group,
      title: title || 'Group',
      content: JSON.stringify(groups),
    });
    // remove temp widget
    removeWidget.mutate(params.id);
  };

  return (
    <WidgetWrapper>
      <div className="flex h-11 shrink-0 items-center justify-between px-3">
        <div className="w-6 shrink-0" />
        <h3 className="text-center font-semibold text-neutral-900 dark:text-neutral-100">
          Adding group feeds
        </h3>
        <button
          type="button"
          onClick={() => removeWidget.mutate(params.id)}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-900 backdrop-blur-xl hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
        >
          <CancelIcon className="h-3 w-3" />
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex min-h-0 flex-1 flex-col gap-2 px-3 pb-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Group name"
            className="relative h-11 w-full rounded-lg bg-neutral-100 px-3 py-1 text-neutral-900 !outline-none placeholder:text-neutral-500 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-300"
          />
          <div className="flex-grow-1 flex flex-1 shrink basis-0 flex-col overflow-y-auto rounded-xl bg-neutral-50 dark:bg-neutral-950">
            <div className="flex h-10 shrink-0 items-center border-b border-neutral-100 px-4 text-sm font-semibold dark:border-neutral-900">
              Add users {title ? 'to ' + title : ''}
            </div>
            {db.account.circles.map((item: string) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleGroup(item)}
                className="inline-flex transform items-center justify-between px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <User pubkey={item} variant="simple" />
                {groups.includes(item) ? (
                  <CheckCircleIcon className="h-5 w-5 text-teal-500" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-14 shrink-0 gap-2 border-t border-neutral-100 px-3 pt-2.5 dark:border-neutral-900">
          <button
            type="submit"
            disabled={groups.length < 1}
            onClick={submit}
            className="inline-flex h-9 w-full items-center justify-between gap-2 rounded-lg bg-blue-500 px-6 font-medium text-white hover:bg-blue-600 focus:outline-none disabled:opacity-50"
          >
            <span className="w-5" />
            <span>Add {groups.length} user to group feed</span>
            <ArrowRightCircleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </WidgetWrapper>
  );
}
