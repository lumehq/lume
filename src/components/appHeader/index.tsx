import { NoteConnector } from '@components/note/connector';

import { ArrowLeftIcon, ArrowRightIcon, ReloadIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/router';

export default function AppHeader() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  const reload = () => {
    router.reload();
  };

  return (
    <div data-tauri-drag-region className="flex h-full w-full flex-1 items-center justify-between px-2">
      <div className="flex h-full items-center gap-2 pl-[68px]">
        <button
          onClick={() => goBack()}
          className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900"
        >
          <ArrowLeftIcon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
        </button>
        <button
          onClick={() => goForward()}
          className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900"
        >
          <ArrowRightIcon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
        </button>
        <button
          onClick={() => reload()}
          className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900"
        >
          <ReloadIcon className="h-[14px] w-[14px] text-zinc-500 group-hover:text-zinc-300" />
        </button>
      </div>
      <div>
        <NoteConnector />
      </div>
    </div>
  );
}
