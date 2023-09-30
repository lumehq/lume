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
          <HandArrowDownIcon className="text-white/5" />
        </div>
        <button
          type="button"
          onClick={() =>
            setWidget(db, { kind: WidgetKinds.tmp.list, title: '', content: '' })
          }
          className="inline-flex h-9 items-center gap-2 rounded-lg border-t border-white/10 bg-white/20 px-3 text-white hover:bg-white/30"
        >
          <PlusIcon className="h-4 w-4 text-white" />
          <p className="text-sm font-semibold leading-none">Add widget</p>
        </button>
      </div>
    </div>
  );
}
