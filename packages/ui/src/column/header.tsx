import { CancelIcon, RefreshIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { getCurrent } from "@tauri-apps/api/window";
import { ReactNode } from "react";

export function ColumnHeader({
  label,
  name,
  className,
  children,
}: {
  label: string;
  name: string;
  className?: string;
  children?: ReactNode;
}) {
  const reload = () => {
    window.location.reload();
  };

  const close = async () => {
    const mainWindow = getCurrent();
    await mainWindow.emit("columns", { type: "remove", label });
  };

  return (
    <div
      className={cn(
        "h-11 w-full flex items-center justify-between shrink-0 px-3 border-b border-neutral-100 dark:border-neutral-900",
        className,
      )}
    >
      {!children ? (
        <div className="text-[13px] font-medium">{name}</div>
      ) : (
        children
      )}
      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={reload}
          className="size-7 inline-flex hover:bg-neutral-100 rounded-md dark:hover:bg-neutral-900 items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          <RefreshIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={close}
          className="size-7 inline-flex items-center hover:bg-neutral-100 rounded-md dark:hover:bg-neutral-900 justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          <CancelIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
