import { PlusIcon } from '@shared/icons';
import { WidgetWrapper } from '@shared/widgets';

import { WIDGET_KIND } from '@stores/constants';

import { useWidget } from '@utils/hooks/useWidget';

export function ToggleWidgetList() {
  const { addWidget } = useWidget();

  return (
    <WidgetWrapper>
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <button
          type="button"
          onClick={() =>
            addWidget.mutate({ kind: WIDGET_KIND.tmp.list, title: '', content: '' })
          }
          className="inline-flex h-9 items-center gap-2 rounded-full bg-neutral-200 px-3 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
        >
          <PlusIcon className="h-4 w-4 text-neutral-900 dark:text-zinc-100" />
          <p className="text-sm font-semibold leading-none">Add widget</p>
        </button>
      </div>
    </WidgetWrapper>
  );
}
