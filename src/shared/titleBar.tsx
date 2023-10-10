import { useStorage } from '@libs/storage/provider';

import { CancelIcon } from '@shared/icons';

import { useWidgets } from '@stores/widgets';

export function TitleBar({ id, title }: { id?: string; title: string }) {
  const { db } = useStorage();
  const remove = useWidgets((state) => state.removeWidget);

  return (
    <div className="flex h-11 w-full shrink-0 items-center justify-between overflow-hidden px-3">
      <div className="w-6" />
      <h3 className="text-sm font-medium tracking-wide text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      {id ? (
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
