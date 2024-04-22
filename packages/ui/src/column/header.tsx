import { CancelIcon, CheckIcon, RefreshIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useSearch } from "@tanstack/react-router";
import { getCurrent } from "@tauri-apps/api/window";
import { ReactNode, useEffect, useState } from "react";

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
  const search = useSearch({ strict: false });

  const [title, setTitle] = useState(name);
  const [isChanged, setIsChanged] = useState(false);

  const saveNewTitle = async () => {
    const mainWindow = getCurrent();
    await mainWindow.emit("columns", { type: "set_title", label, title });

    // update search params
    // @ts-ignore, hahaha
    search.name = title;

    // reset state
    setIsChanged(false);
  };

  const reload = () => {
    window.location.reload();
  };

  const close = async () => {
    const mainWindow = getCurrent();
    await mainWindow.emit("columns", { type: "remove", label });
  };

  useEffect(() => {
    if (title.length !== name.length) setIsChanged(true);
  }, [title]);

  return (
    <div
      className={cn(
        "h-11 w-full flex items-center justify-between shrink-0 px-3 border-b border-neutral-100 dark:border-neutral-900",
        className,
      )}
    >
      <div className="relative flex gap-2 items-center">
        {!children ? (
          <div
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={(e) => setTitle(e.currentTarget.textContent)}
            className="text-[13px] font-medium focus:outline-none"
          >
            {name}
          </div>
        ) : (
          children
        )}
        {isChanged ? (
          <button
            type="button"
            onClick={saveNewTitle}
            className="text-teal-500 hover:text-teal-600"
          >
            <CheckIcon className="size-4" />
          </button>
        ) : null}
      </div>
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
