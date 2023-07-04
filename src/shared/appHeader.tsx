import { useNavigate } from 'react-router-dom';

import { ArrowLeftIcon, ArrowRightIcon } from '@shared/icons';

export function AppHeader({ reverse }: { reverse?: boolean }) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
  };

  return (
    <div
      data-tauri-drag-region
      className={`flex h-11 w-full shrink-0 items-center border-b border-zinc-900 px-3 ${
        reverse ? 'justify-start' : 'justify-end'
      }`}
    >
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => goBack()}
          className="group inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-900"
        >
          <ArrowLeftIcon
            width={16}
            height={16}
            className="text-zinc-500 group-hover:text-zinc-300"
          />
        </button>
        <button
          type="button"
          onClick={() => goForward()}
          className="group inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-900"
        >
          <ArrowRightIcon
            width={16}
            height={16}
            className="text-zinc-500 group-hover:text-zinc-300"
          />
        </button>
      </div>
    </div>
  );
}
