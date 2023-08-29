import { useStorage } from '@libs/storage/provider';

import { CancelIcon } from '@shared/icons';

import { useWidgets } from '@stores/widgets';

export function TitleBar({ id, title }: { id?: string; title: string }) {
  const { db } = useStorage();
  const remove = useWidgets((state) => state.removeWidget);

  return (
    <div
      data-tauri-drag-region
      className="flex h-11 w-full shrink-0 items-center justify-between overflow-hidden px-3"
    >
      <div className="w-6" />
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {id ? (
        <button
          type="button"
          onClick={() => remove(db, id)}
          className="inline-flex h-6 w-6 shrink-0 transform items-center justify-center rounded backdrop-blur-xl hover:bg-white/10"
        >
          <CancelIcon className="h-3 w-3 text-white" />
        </button>
      ) : (
        <div className="w-6" />
      )}
    </div>
  );
}
