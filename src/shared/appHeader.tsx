import ArrowLeftIcon from '@lume/shared/icons/arrowLeft';
import ArrowRightIcon from '@lume/shared/icons/arrowRight';
import RefreshIcon from '@lume/shared/icons/refresh';

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
      <div className="flex w-full items-center justify-center gap-2">
        <div className="flex h-full items-center gap-2">
          <button
            onClick={() => goBack()}
            className="group inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
          >
            <ArrowLeftIcon width={14} height={14} className="text-zinc-500 group-hover:text-zinc-300" />
          </button>
          <button
            onClick={() => goForward()}
            className="group inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
          >
            <ArrowRightIcon width={14} height={14} className="text-zinc-500 group-hover:text-zinc-300" />
          </button>
        </div>
        <div>
          <input
            autoCapitalize="none"
            autoCorrect="off"
            autoFocus={false}
            placeholder="Search..."
            className="h-6 w-[453px] rounded border border-zinc-800 bg-zinc-900 px-2.5 text-center text-[11px] text-sm leading-5 text-zinc-500 placeholder:leading-5 placeholder:text-zinc-600 focus:outline-none"
          />
        </div>
        <div className="flex h-full items-center gap-2">
          <button
            onClick={() => reload()}
            className="group inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
          >
            <RefreshIcon width={14} height={14} className="text-zinc-500 group-hover:text-zinc-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
