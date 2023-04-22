import AppActions from '@components/appHeader/actions';
import EventCollector from '@components/eventCollector';

export default function AppHeader({ collector }: { collector: boolean }) {
  return (
    <div data-tauri-drag-region className="flex h-full w-full flex-1 items-center px-2">
      <AppActions />
      <div data-tauri-drag-region className="flex h-full w-full items-center justify-between">
        <div className="flex h-full items-center divide-x divide-zinc-900 px-4 pt-px"></div>
        <div>{collector && <EventCollector />}</div>
      </div>
    </div>
  );
}
