import { TitleBar } from '@shared/titleBar';
import { WidgetWrapper } from '@shared/widgets';

import { Widget } from '@utils/types';

export function WidgetList({ widget }: { widget: Widget }) {
  return (
    <WidgetWrapper>
      <TitleBar id={widget.id} title="Add widgets" />
      <div className="flex-1 overflow-y-auto pb-10 scrollbar-none">
        <div className="flex flex-col gap-6 px-3">
          <div className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <button
              type="button"
              disabled
              className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-neutral-50 text-sm font-medium text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
            >
              Build your own widget{' '}
              <div className="-rotate-3 transform-gpu rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-1 dark:border-neutral-800 dark:bg-neutral-900">
                <span className="bg-gradient-to-r from-blue-400 via-red-400 to-orange-500 bg-clip-text text-xs text-transparent dark:from-blue-200 dark:via-red-200 dark:to-orange-300">
                  Coming soon
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
}
