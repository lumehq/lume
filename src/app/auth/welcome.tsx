import { LogicalSize, appWindow } from '@tauri-apps/plugin-window';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { ArrowRightCircleIcon } from '@shared/icons/arrowRightCircle';

export function WelcomeScreen() {
  useEffect(() => {
    async function setWindow() {
      await appWindow.setSize(new LogicalSize(400, 500));
      await appWindow.setResizable(false);
    }
    setWindow();

    return () => {
      appWindow.setSize(new LogicalSize(1080, 800)).then(() => {
        appWindow.setResizable(false);
        appWindow.center();
      });
    };
  }, []);

  return (
    <div className="flex h-screen w-full flex-col justify-between bg-white/10">
      <div className="flex flex-col gap-10 pt-16">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-medium text-white">Welcome to Lume</h1>
          <h3 className="mx-auto w-2/3 text-white/50">
            Let&apos;s get you up and connecting with all peoples around the world on
            Nostr
          </h3>
        </div>
        <div className="inline-flex w-full flex-col items-center gap-3 px-4 pb-10">
          <Link
            to="/auth/import"
            className="inline-flex h-11 w-2/3 items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none"
          >
            <span className="w-5" />
            <span>Login with private key</span>
            <ArrowRightCircleIcon className="h-5 w-5" />
          </Link>
          <Link
            to="/auth/create"
            className="inline-flex h-11 w-2/3 items-center justify-center gap-2 rounded-lg bg-white/10 px-6 font-medium leading-none text-zinc-200 hover:bg-white/20 focus:outline-none"
          >
            Create new key
          </Link>
        </div>
      </div>
      <div className="flex flex-1 items-end justify-center pb-10">
        <img src="/lume.png" alt="lume" className="h-auto w-1/3" />
      </div>
    </div>
  );
}
