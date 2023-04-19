import AppHeader from '@components/appHeader';
import MultiAccounts from '@components/multiAccounts';

export default function NostrLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      <div className="flex h-screen w-full flex-col">
        <div
          data-tauri-drag-region
          className="relative h-11 shrink-0 border-b border-zinc-100 bg-white dark:border-zinc-900 dark:bg-black"
        >
          <AppHeader collector={true} />
        </div>
        <div className="relative flex min-h-0 w-full flex-1">
          <div className="relative w-[68px] shrink-0 border-r border-zinc-900">
            <MultiAccounts />
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
