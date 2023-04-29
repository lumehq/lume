import ArrowLeftIcon from '@lume/shared/icons/arrowLeft';
import ArrowRightIcon from '@lume/shared/icons/arrowRight';
import RefreshIcon from '@lume/shared/icons/refresh';

let platformName = 'darwin';

if (typeof window !== 'undefined') {
  const { platform } = await import('@tauri-apps/api/os');
  platformName = await platform();
}

export default function AppHeader() {
  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  const reload = () => {
    window.location.reload();
  };

  return (
    <div data-tauri-drag-region className="flex h-full w-full flex-1 items-center px-2">
      <div className={`flex h-full items-center gap-2 ${platformName === 'darwin' ? 'pl-[68px]' : ''}`}>
        <button
          onClick={() => goBack()}
          className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900"
        >
          <ArrowLeftIcon width={16} height={16} className="text-zinc-500 group-hover:text-zinc-300" />
        </button>
        <button
          onClick={() => goForward()}
          className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900"
        >
          <ArrowRightIcon width={16} height={16} className="text-zinc-500 group-hover:text-zinc-300" />
        </button>
        <button
          onClick={() => reload()}
          className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900"
        >
          <RefreshIcon width={16} height={16} className="text-zinc-500 group-hover:text-zinc-300" />
        </button>
      </div>
      <div data-tauri-drag-region className="flex h-full w-full items-center justify-between">
        <div className="flex h-full items-center divide-x divide-zinc-900 px-4 pt-px"></div>
      </div>
    </div>
  );
}
