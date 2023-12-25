import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HorizontalDotsIcon,
  RefreshIcon,
  ThreadIcon,
  TrashIcon,
} from '@lume/icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useWidget } from '../../hooks/useWidget';

export function WidgetHeader({
  id,
  title,
  queryKey,
  icon,
}: {
  id: string;
  title: string;
  queryKey?: string[];
  icon?: ReactNode;
}) {
  const queryClient = useQueryClient();
  const { removeWidget } = useWidget();

  const refresh = async () => {
    if (queryKey) await queryClient.refetchQueries({ queryKey });
  };

  const moveLeft = async () => {
    removeWidget.mutate(id);
  };

  const moveRight = async () => {
    removeWidget.mutate(id);
  };

  const deleteWidget = async () => {
    removeWidget.mutate(id);
  };

  return (
    <div className="flex h-11 w-full shrink-0 items-center justify-between border-b border-neutral-100 px-3 dark:border-neutral-900">
      <div className="inline-flex items-center gap-4">
        <div className="h-5 w-1 rounded-full bg-blue-500" />
        <div className="inline-flex items-center gap-2">
          {icon ? icon : <ThreadIcon className="h-5 w-5" />}
          <div className="text-sm font-medium">{title}</div>
        </div>
      </div>
      <div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="inline-flex h-6 w-6 items-center justify-center"
            >
              <HorizontalDotsIcon className="h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="flex w-[220px] flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white p-2 shadow-lg shadow-neutral-200/50 focus:outline-none dark:border-neutral-900 dark:bg-neutral-950 dark:shadow-neutral-900/50">
              <DropdownMenu.Item asChild>
                <button
                  type="button"
                  onClick={refresh}
                  className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-neutral-700 hover:bg-blue-100 hover:text-blue-500 focus:outline-none dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                >
                  <RefreshIcon className="h-5 w-5" />
                  Refresh
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <button
                  type="button"
                  onClick={moveLeft}
                  className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-neutral-700 hover:bg-blue-100 hover:text-blue-500 focus:outline-none dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  Move left
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <button
                  type="button"
                  onClick={moveRight}
                  className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-neutral-700 hover:bg-blue-100 hover:text-blue-500 focus:outline-none dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                  Move right
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-neutral-100 dark:bg-neutral-900" />
              <DropdownMenu.Item asChild>
                <button
                  type="button"
                  onClick={deleteWidget}
                  className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-red-500 hover:bg-red-500 hover:text-red-50 focus:outline-none"
                >
                  <TrashIcon className="h-5 w-5" />
                  Delete
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}
