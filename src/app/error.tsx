import { useEffect, useState } from 'react';
import { useLocation, useRouteError } from 'react-router-dom';

interface RouteError {
  statusText: string;
  message: string;
}

interface DebugInfo {
  os: null | string;
  version: null | string;
  appDir: null | string;
}

export function ErrorScreen() {
  const error = useRouteError() as RouteError;
  const location = useLocation();

  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    os: null,
    version: null,
    appDir: null,
  });

  useEffect(() => {
    async function getInformation() {
      const { platform, version } = await import('@tauri-apps/api/os');
      const { getVersion } = await import('@tauri-apps/api/app');
      const { appConfigDir } = await import('@tauri-apps/api/path');

      const platformName = await platform();
      const osVersion = await version();
      const appVersion = await getVersion();
      const appDir = await appConfigDir();

      setDebugInfo({
        os: platformName + ' ' + osVersion,
        version: appVersion,
        appDir: appDir,
      });
    }

    getInformation();
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex w-full flex-col gap-4 px-4 md:max-w-lg md:px-0">
        <div className="flex flex-col">
          <h1 className="mb-1 text-2xl font-semibold text-white">
            Sorry, an unexpected error has occurred.
          </h1>
          <div className="mt-4 inline-flex h-16 items-center justify-center rounded-xl border border-dashed border-red-400 bg-red-200/10 px-5">
            <p className="select-text text-sm font-medium text-red-400">
              {error.statusText || error.message}
            </p>
          </div>
          <div className="mt-4">
            <p className="font-medium text-white/50">
              Current location: {location.pathname}
            </p>
            <p className="font-medium text-white/50">App version: {debugInfo.version}</p>
            <p className="font-medium text-white/50">Platform: {debugInfo.os}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href="https://github.com/luminous-devs/lume/issues/new"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
          >
            Click here to report the issue on GitHub
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
          >
            Reload app
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium text-white backdrop-blur-xl hover:bg-white/10"
          >
            Reset app
          </button>
        </div>
      </div>
    </div>
  );
}
