import { ChevronDownIcon, RefreshIcon, TrashIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { getCurrent } from "@tauri-apps/api/window";

export function ColumnHeader({
  id,
  name,
  className,
}: {
  id: number;
  name: string;
  className?: string;
}) {
  const reload = () => {
    window.location.reload();
  };

  const close = async () => {
    const mainWindow = getCurrent();
    await mainWindow.emit("columns", { type: "remove", id });
  };

  return (
    <DropdownMenu.Root>
      <div
        className={cn(
          "flex h-11 w-full shrink-0 items-center justify-center gap-2 border-b border-neutral-100 dark:border-neutral-900",
          className,
        )}
      >
        <DropdownMenu.Trigger asChild>
          <button type="button" className="inline-flex items-center gap-2">
            <div className="text-[13px] font-medium">{name}</div>
            <ChevronDownIcon className="size-4" />
          </button>
        </DropdownMenu.Trigger>
      </div>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          className="flex w-[200px] flex-col overflow-hidden rounded-xl bg-black p-1 focus:outline-none dark:bg-white"
        >
          <DropdownMenu.Item
            onClick={reload}
            className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
          >
            <RefreshIcon className="size-4" />
            Reload
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={close}
            className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white hover:bg-neutral-900 focus:outline-none dark:text-black dark:hover:bg-neutral-100"
          >
            <TrashIcon className="size-4" />
            Close
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="fill-black dark:fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
