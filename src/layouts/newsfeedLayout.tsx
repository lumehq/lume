import AccountBar from '@components/accountBar';
import NavigatorBar from '@components/navigatorBar';

export default function NewsFeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-row">
      <div className="relative h-full w-[70px] shrink-0 border-r border-zinc-900">
        <div data-tauri-drag-region className="absolute top-0 left-0 h-12 w-full" />
        <AccountBar />
      </div>
      <div className="grid grow grid-cols-4">
        <div className="col-span-1">
          <NavigatorBar />
        </div>
        <div className="col-span-3 m-3 ml-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
          <div className="h-full w-full rounded-lg">{children}</div>
        </div>
      </div>
    </div>
  );
}
