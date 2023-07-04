import { CancelIcon } from '@shared/icons';

export function TitleBar({
  title,
  onClick = undefined,
}: {
  title: string;
  onClick?: () => void;
}) {
  return (
    <div
      data-tauri-drag-region
      className="group flex h-11 w-full shrink-0 items-center justify-between overflow-hidden border-b border-zinc-900 px-3"
    >
      <div className="w-6" />
      <h3 className="text-sm font-medium text-zinc-200">{title}</h3>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex h-6 w-6 shrink translate-y-8 transform items-center justify-center rounded transition-transform duration-150 ease-in-out hover:bg-zinc-900 group-hover:translate-y-0"
        >
          <CancelIcon width={12} height={12} className="text-zinc-300" />
        </button>
      ) : (
        <div className="w-6" />
      )}
    </div>
  );
}
