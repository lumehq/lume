import { useStorage } from '@libs/storage/provider';

import { CancelIcon } from '@shared/icons';
import { User } from '@shared/user';

import { useWidgets } from '@stores/widgets';

export function TitleBar({ id, title }: { id?: string; title?: string }) {
  const { db } = useStorage();
  const remove = useWidgets((state) => state.removeWidget);

  return (
    <div className="flex h-11 w-full shrink-0 items-center justify-between overflow-hidden px-3">
      <div className="w-6" />
      {id === '9999' ? (
        <div className="isolate flex -space-x-2">
          {db.account.circles
            ?.slice(0, 10)
            .map((item) => <User key={item} pubkey={item} variant="ministacked" />)}
          {db.account.circles?.length > 10 ? (
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-neutral-900 ring-1 ring-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-700">
              <span className="text-xs font-medium">
                +{db.account.circles?.length - 10}
              </span>
            </div>
          ) : null}
        </div>
      ) : (
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
      )}
      {id !== '9999' ? (
        <button
          type="button"
          onClick={() => remove(db, id)}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-900 backdrop-blur-xl hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
        >
          <CancelIcon className="h-3 w-3" />
        </button>
      ) : (
        <div className="w-6" />
      )}
    </div>
  );
}
