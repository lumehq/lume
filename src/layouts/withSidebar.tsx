import AppHeader from '@components/appHeader';
import AccountColumn from '@components/columns/account';
import NavigatorColumn from '@components/columns/navigator';

export default function WithSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col">
      <div
        data-tauri-drag-region
        className="relative h-11 shrink-0 border-b border-zinc-100 bg-white dark:border-zinc-900 dark:bg-black"
      >
        <AppHeader />
      </div>
      <div className="relative flex h-full w-full flex-1 flex-row">
        <div className="relative w-[68px] shrink-0 border-r border-zinc-900">
          <div className="absolute top-0 left-0 h-12 w-full" />
          <AccountColumn />
        </div>
        <div className="grid grow grid-cols-4">
          <div className="col-span-1 border-r border-zinc-900">
            <NavigatorColumn />
          </div>
          <div className="col-span-3 m-3 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
            <div className="h-full w-full rounded-lg">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
