import { ArrowLeft, ArrowRight, Refresh } from 'iconoir-react';
import { useCallback, useEffect, useState } from 'react';

export default function AppActions() {
  const [os, setOS] = useState('');

  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  const reload = () => {
    window.location.reload();
  };

  const getPlatform = useCallback(async () => {
    const { platform } = await import('@tauri-apps/api/os');
    const result = await platform();

    setOS(result);
  }, []);

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getPlatform().catch(console.error);
    }

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className={`flex h-full items-center gap-2 ${os === 'darwin' ? 'pl-[68px]' : ''}`}>
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
