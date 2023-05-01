import ArrowLeftIcon from '@lume/shared/icons/arrowLeft';
import ArrowRightIcon from '@lume/shared/icons/arrowRight';

let platformName = 'darwin';

if (typeof window !== 'undefined') {
  const { platform } = await import('@tauri-apps/api/os');
  platformName = await platform();
}

export function LayoutOnboarding({ children }: { children: React.ReactNode }) {
  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  return (
    <div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white">
      <div className="flex h-screen w-full flex-col">
        <div
          data-tauri-drag-region
          className="relative h-11 shrink-0 border border-zinc-100 bg-white dark:border-zinc-900 dark:bg-black"
        >
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
            </div>
          </div>
        </div>
        <div className="relative flex min-h-0 w-full flex-1">{children}</div>
      </div>
    </div>
  );
}
