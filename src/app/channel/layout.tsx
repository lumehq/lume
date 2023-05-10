import AppHeader from '@shared/appHeader';
import MultiAccounts from '@shared/multiAccounts';
import Navigation from '@shared/navigation';

export function LayoutChannel({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white">
      <div className="flex h-screen w-full flex-col">
        <div
          data-tauri-drag-region
          className="relative h-9 shrink-0 border-b border-zinc-100 bg-white dark:border-zinc-900 dark:bg-black"
        >
          <AppHeader />
        </div>
        <div className="relative flex min-h-0 w-full flex-1">
          <div className="relative w-[68px] shrink-0 border-r border-zinc-900">
            <MultiAccounts />
          </div>
          <div className="grid w-full grid-cols-4 xl:grid-cols-5">
            <div className="scrollbar-hide col-span-1 overflow-y-auto overflow-x-hidden border-r border-zinc-900">
              <Navigation />
            </div>
            <div className="col-span-3 m-3 overflow-hidden xl:col-span-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
