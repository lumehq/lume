import { useStorage } from '@libs/storage/provider';

import { HandArrowDownIcon, PlusIcon } from '@shared/icons';

import { WidgetKinds, useWidgets } from '@stores/widgets';

export function ToggleWidgetList() {
  const { db } = useStorage();
  const setWidget = useWidgets((state) => state.setWidget);

  return (
    <div className="flex h-full shrink-0 grow-0 basis-[400px] items-center justify-center">
      <div className="relative">
        <div className="absolute -top-44 left-1/2 -translate-x-1/2 transform">
          <HandArrowDownIcon className="text-zinc-100 dark:text-zinc-900" />
        </div>
        <button
          type="button"
          onClick={() =>
            setWidget(db, { kind: WidgetKinds.tmp.list, title: '', content: '' })
          }
          className="inline-flex h-9 items-center gap-2 rounded-full bg-zinc-200 px-3 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          <PlusIcon className="h-4 w-4 text-white" />
          <p className="text-sm font-semibold leading-none">Add widget</p>
        </button>
      </div>
    </div>
  );
}
