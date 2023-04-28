import EventCollector from '@lume/shared/eventCollector';

import { ArrowLeft, ArrowRight, Refresh } from 'iconoir-react';

let platformName = 'darwin';

if (typeof window !== 'undefined') {
  const { platform } = await import('@tauri-apps/api/os');
  platformName = await platform();
}

export default function AppHeader({ collector }: { collector: boolean }) {
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
          <ArrowLeft width={16} height={16} className="text-zinc-500 group-hover:text-zinc-300" />
        </button>
        <button
          onClick={() => goForward()}
          className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900"
        >
          <ArrowRight width={16} height={16} className="text-zinc-500 group-hover:text-zinc-300" />
        </button>
        <button
          onClick={() => reload()}
          className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900"
        >
          <Refresh width={16} height={16} className="text-zinc-500 group-hover:text-zinc-300" />
        </button>
      </div>
      <div data-tauri-drag-region className="flex h-full w-full items-center justify-between">
        <div className="flex h-full items-center divide-x divide-zinc-900 px-4 pt-px"></div>
        {collector && <EventCollector />}
      </div>
    </div>
  );
}
