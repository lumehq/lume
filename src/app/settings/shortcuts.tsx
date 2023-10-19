import { CommandIcon } from '@shared/icons';

export function ShortcutsSettingsScreen() {
  return (
    <div className="h-full w-full px-3 pt-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-white">Shortcuts</h1>
        <div className="w-full rounded-xl bg-neutral-400 dark:bg-neutral-600">
          <div className="flex h-full w-full flex-col divide-y divide-white/5">
            <div className="inline-flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium leading-none text-white">Open composer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-400 dark:bg-neutral-600">
                  <CommandIcon
                    width={12}
                    height={12}
                    className="text-neutral-600 dark:text-neutral-400"
                  />
                </div>
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-400 dark:bg-neutral-600">
                  <span className="text-sm leading-none text-neutral-600 dark:text-neutral-400">
                    N
                  </span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium leading-none text-white">
                  Add image block
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-400 dark:bg-neutral-600">
                  <CommandIcon
                    width={12}
                    height={12}
                    className="text-neutral-600 dark:text-neutral-400"
                  />
                </div>
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-400 dark:bg-neutral-600">
                  <span className="text-sm leading-none text-neutral-600 dark:text-neutral-400">
                    I
                  </span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium leading-none text-white">
                  Add newsfeed block
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-400 dark:bg-neutral-600">
                  <CommandIcon
                    width={12}
                    height={12}
                    className="text-neutral-600 dark:text-neutral-400"
                  />
                </div>
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-400 dark:bg-neutral-600">
                  <span className="text-sm leading-none text-neutral-600 dark:text-neutral-400">
                    F
                  </span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium leading-none text-white">
                  Open personal page
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-400 dark:bg-neutral-600">
                  <CommandIcon
                    width={12}
                    height={12}
                    className="text-neutral-600 dark:text-neutral-400"
                  />
                </div>
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-400 dark:bg-neutral-600">
                  <span className="text-sm leading-none text-neutral-600 dark:text-neutral-400">
                    P
                  </span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium leading-none text-white">
                  Open notification
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-400 dark:bg-neutral-600">
                  <CommandIcon
                    width={12}
                    height={12}
                    className="text-neutral-600 dark:text-neutral-400"
                  />
                </div>
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-400 dark:bg-neutral-600">
                  <span className="text-sm leading-none text-neutral-600 dark:text-neutral-400">
                    B
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
