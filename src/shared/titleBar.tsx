import { useStorage } from '@libs/storage/provider';

import { CancelIcon } from '@shared/icons';
import { User } from '@shared/user';

import { useWidget } from '@utils/hooks/useWidget';

export function TitleBar({
  id,
  title,
  isLive,
}: {
  id?: string;
  title?: string;
  isLive?: boolean;
}) {
  const { db } = useStorage();
  const { removeWidget } = useWidget();

  return (
    <div className="grid h-11 w-full shrink-0 grid-cols-3 items-center px-3">
      <div className="col-span-1 flex justify-start">
        {isLive ? (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
            </span>
            <p className="text-xs font-medium text-teal-500">Live</p>
          </div>
        ) : null}
      </div>
      <div className="col-span-1 flex justify-center">
        {id === '9999' ? (
          <div className="isolate flex -space-x-2">
            {db.account.circles
              ?.slice(0, 8)
              .map((item) => <User key={item} pubkey={item} variant="ministacked" />)}
            {db.account.circles?.length > 8 ? (
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-300 text-neutral-900 ring-1 ring-white dark:bg-neutral-700 dark:text-neutral-100 dark:ring-black">
                <span className="text-[8px] font-medium">
                  +{db.account.circles?.length - 8}
                </span>
              </div>
            ) : null}
          </div>
        ) : (
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
        )}
      </div>
      <div className="col-span-1 flex justify-end">
        {id !== '9999' && id !== '9998' ? (
          <button
            type="button"
            onClick={() => removeWidget.mutate(id)}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-900 backdrop-blur-xl hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            <CancelIcon className="h-3 w-3" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
