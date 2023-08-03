import { CommandIcon } from '@shared/icons';

export function ShortcutsSettingsScreen() {
  return (
    <div className="h-full w-full px-3 pt-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-white">Shortcuts</h1>
        <div className="w-full rounded-xl border-t border-zinc-800/50 bg-zinc-900">
          <div className="flex h-full w-full flex-col divide-y divide-zinc-800">
            <div className="inline-flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium leading-none text-zinc-200">
                  Open composer
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
                  <CommandIcon width={12} height={12} className="text-zinc-500" />
                </div>
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
                  <span className="text-sm leading-none text-zinc-500">N</span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium leading-none text-zinc-200">
                  Add image block
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
                  <CommandIcon width={12} height={12} className="text-zinc-500" />
                </div>
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
                  <span className="text-sm leading-none text-zinc-500">I</span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium leading-none text-zinc-200">
                  Add newsfeed block
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
                  <CommandIcon width={12} height={12} className="text-zinc-500" />
                </div>
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
                  <span className="text-sm leading-none text-zinc-500">F</span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium leading-none text-zinc-200">
                  Open personal page
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
                  <CommandIcon width={12} height={12} className="text-zinc-500" />
                </div>
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
                  <span className="text-sm leading-none text-zinc-500">P</span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium leading-none text-zinc-200">
                  Open notification
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
                  <CommandIcon width={12} height={12} className="text-zinc-500" />
                </div>
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-700/50 bg-zinc-800">
                  <span className="text-sm leading-none text-zinc-500">B</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
