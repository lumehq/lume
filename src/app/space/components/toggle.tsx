import { useStorage } from '@libs/storage/provider';

import { PlusIcon } from '@shared/icons';

import { WidgetKinds, useWidgets } from '@stores/widgets';

export function ToggleWidgetList() {
  const { db } = useStorage();
  const setWidget = useWidgets((state) => state.setWidget);

  return (
    <div className="relative flex h-full shrink-0 grow-0 basis-[400px] items-center justify-center">
      <button
        type="button"
        onClick={() =>
          setWidget(db, { kind: WidgetKinds.tmp.list, title: '', content: '' })
        }
        className="inline-flex items-center gap-2 text-white"
      >
        <PlusIcon className="h-4 w-4 text-white" />
        <p className="text-sm font-bold leading-none">Add widget</p>
      </button>
    </div>
  );
}
