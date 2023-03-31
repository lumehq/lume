import { ArrowLeftIcon, ArrowRightIcon, ReloadIcon } from '@radix-ui/react-icons';
import { platform } from '@tauri-apps/api/os';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AppActions() {
  const router = useRouter();
  const [os, setOS] = useState('');

  const goBack = () => {
    router.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  const reload = () => {
    router.reload();
  };

  useEffect(() => {
    const getPlatform = async () => {
      const result = await platform();
      setOS(result);
    };

    getPlatform().catch(console.error);
  }, []);

  return (
    <div className={`flex h-full items-center gap-2 ${os === 'darwin' ? 'pl-[68px]' : ''}`}>
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
  );
}
