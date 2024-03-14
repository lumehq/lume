import {
  ChevronDownIcon,
  MoveLeftIcon,
  MoveRightIcon,
  RefreshIcon,
  TrashIcon,
} from "@lume/icons";
import { cn } from "@lume/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";

export function ColumnHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <DropdownMenu.Root>
      <div
        className={cn(
          "flex h-11 w-full shrink-0 items-center justify-center gap-2 border-b border-neutral-100 dark:border-neutral-900",
          className,
        )}
      >
        <DropdownMenu.Trigger asChild>
          <div className="inline-flex items-center gap-1.5">
            <div className="text-[13px] font-medium">{title}</div>
            <ChevronDownIcon className="size-5" />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={5}
            className="flex w-[200px] flex-col overflow-hidden rounded-2xl bg-white/50 p-2 ring-1 ring-black/10 backdrop-blur-2xl focus:outline-none dark:bg-black/50 dark:ring-white/10"
          >
            <DropdownMenu.Item asChild>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <RefreshIcon className="size-4" />
                {t("global.refresh")}
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <MoveLeftIcon className="size-4" />
                {t("global.moveLeft")}
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <MoveRightIcon className="size-4" />
                {t("global.moveRight")}
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-black/10 dark:bg-white/10" />
            <DropdownMenu.Item asChild>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-red-500 hover:bg-red-500 hover:text-red-50 focus:outline-none"
              >
                <TrashIcon className="size-4" />
                {t("global.delete")}
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </div>
    </DropdownMenu.Root>
  );
}
