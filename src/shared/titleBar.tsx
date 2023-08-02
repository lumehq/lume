import { CancelIcon } from '@shared/icons';

import { useBlock } from '@utils/hooks/useBlock';

export function TitleBar({ id, title }: { id?: string; title: string }) {
  const { remove } = useBlock();

  return (
    <div
      data-tauri-drag-region
      className="group flex h-11 w-full shrink-0 items-center justify-between overflow-hidden px-3"
    >
      <div className="w-6" />
      <h3 className="text-sm font-medium text-white">{title}</h3>
      {id ? (
        <button
          type="button"
          onClick={() => remove.mutate(id)}
          className="inline-flex h-6 w-6 shrink translate-y-8 transform items-center justify-center rounded transition-transform duration-150 ease-in-out hover:bg-white/10 group-hover:translate-y-0"
        >
          <CancelIcon className="h-3 w-3 text-white" />
        </button>
      ) : (
        <div className="w-6" />
      )}
    </div>
  );
}
