import { NoteConnector } from '@components/note/connector';

import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/router';

export default function AppHeader() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  return (
    <div data-tauri-drag-region className="flex h-full w-full items-center">
      <div className="relative w-[68px] shrink-0">{/* macos traffic lights */}</div>
      <div className="flex w-full flex-1 items-center justify-between px-2">
        <div className="flex h-full gap-2">
          <button onClick={() => goBack()} className="group rounded-md p-1 hover:bg-zinc-900">
            <ArrowLeftIcon className="h-5 w-5 text-zinc-500 group-hover:text-zinc-300" />
          </button>
          <button onClick={() => goForward()} className="group rounded-md p-1 hover:bg-zinc-900">
            <ArrowRightIcon className="h-5 w-5 text-zinc-500 group-hover:text-zinc-300" />
          </button>
        </div>
        <div>
          <NoteConnector />
        </div>
      </div>
    </div>
  );
}
