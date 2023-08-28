import { useEffect, useState } from 'react';
import { useLocation, useRouteError } from 'react-router-dom';

interface IRouteError {
  statusText: string;
  message: string;
}

interface IDebugInfo {
  os: null | string;
  version: null | string;
}

export function ErrorScreen() {
  const error = useRouteError() as IRouteError;
  const location = useLocation();

  const [debugInfo, setDebugInfo] = useState<IDebugInfo>({ os: null, version: null });

  useEffect(() => {
    async function getInformation() {
      const { platform, version } = await import('@tauri-apps/plugin-os');
      const { getVersion } = await import('@tauri-apps/plugin-app');

      const platformName = await platform();
      const osVersion = await version();
      const appVersion = await getVersion();

      setDebugInfo({ os: platformName + ' ' + osVersion, version: appVersion });
    }

    getInformation();
  }, []);

  return (
    <div className="flex h-full items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="flex max-w-lg flex-col gap-4">
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
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-white/10 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/20"
          >
            Click here to report the issue on GitHub
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-white/10 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/20"
          >
            Reload app
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-white/10 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/20"
          >
            Reset app
          </button>
        </div>
      </div>
    </div>
  );
}
