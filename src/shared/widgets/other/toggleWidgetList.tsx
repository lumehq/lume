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
            addWidget.mutate({ kind: WIDGET_KIND.list, title: '', content: '' })
          }
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
    </WidgetWrapper>
  );
}
