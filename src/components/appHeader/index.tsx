import AppActions from '@components/appHeader/actions';
import { NoteConnector } from '@components/note/connector';

import { PlusIcon } from '@radix-ui/react-icons';

export default function AppHeader() {
  return (
    <div data-tauri-drag-region className="flex h-full w-full flex-1 items-center px-2">
      <AppActions />
      <div data-tauri-drag-region className="flex h-full w-full items-center justify-between">
        <div className="flex h-full items-center divide-x divide-zinc-900 px-4 py-px">
          <div className="group inline-flex h-full w-24 items-center justify-center border-l border-zinc-900 hover:bg-zinc-900">
            <span className="text-sm font-medium leading-none text-zinc-400 group-hover:text-zinc-100">Home</span>
          </div>
          <div className="inline-flex h-full w-16 items-center justify-center border-r border-zinc-900">
            <button className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900">
              <PlusIcon className="h-4 w-4 text-zinc-400 group-hover:text-zinc-100" />
            </button>
          </div>
        </div>
        <div>
          <NoteConnector />
        </div>
      </div>
    </div>
  );
}
