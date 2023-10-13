import { useStorage } from '@libs/storage/provider';

import { HandArrowDownIcon, PlusIcon } from '@shared/icons';

import { WidgetKinds, useWidgets } from '@stores/widgets';

export function ToggleWidgetList() {
  const { db } = useStorage();
  const setWidget = useWidgets((state) => state.setWidget);

  return (
    <div className="flex h-full w-[420px] items-center justify-center border-r border-neutral-100 dark:border-neutral-900">
      <div className="relative">
        <div className="absolute -top-44 left-1/2 -translate-x-1/2 transform">
          <HandArrowDownIcon className="text-neutral-100 dark:text-neutral-900" />
        </div>
        <button
          type="button"
          onClick={() =>
            setWidget(db, { kind: WidgetKinds.tmp.list, title: '', content: '' })
          }
          className="inline-flex h-9 items-center gap-2 rounded-full bg-neutral-200 px-3 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
        >
          <PlusIcon className="h-4 w-4 text-neutral-900 dark:text-zinc-100" />
          <p className="text-sm font-semibold leading-none">Add widget</p>
        </button>
      </div>
    </div>
  );
}
