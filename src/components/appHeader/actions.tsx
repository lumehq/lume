import { ArrowLeft, ArrowRight, Refresh } from 'iconoir-react';

export default function AppActions() {
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
    <div className={`flex h-full items-center gap-2 pl-[68px]`}>
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
  );
}
