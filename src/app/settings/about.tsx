import { getVersion } from '@tauri-apps/api/app';
import { relaunch } from '@tauri-apps/plugin-process';
import { Update, check } from '@tauri-apps/plugin-updater';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function AboutScreen() {
  const [version, setVersion] = useState('');
  const [newUpdate, setNewUpdate] = useState<Update>(null);

  const checkUpdate = async () => {
    const update = await check();
    if (update) setNewUpdate(update);
  };

  const installUpdate = async () => {
    await newUpdate.downloadAndInstall();
    await relaunch();
  };

  useEffect(() => {
    async function loadVersion() {
      const appVersion = await getVersion();
      setVersion(appVersion);
    }

    loadVersion();
  }, []);

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="flex items-center justify-center gap-2">
        <img src="/icon.png" alt="Lume's logo" className="w-16 shrink-0" />
        <div>
          <h1 className="text-xl font-semibold">Lume</h1>
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Version {version}
          </p>
        </div>
      </div>
      <div className="mx-auto mt-4 flex w-full max-w-xs flex-col gap-2">
        {!newUpdate ? (
          <button
            type="button"
            onClick={() => checkUpdate()}
            className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-blue-500 text-sm font-medium text-white hover:bg-blue-600"
          >
            Check for update
          </button>
        ) : (
          <button
            type="button"
            onClick={() => installUpdate()}
            className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-blue-500 text-sm font-medium text-white hover:bg-blue-600"
          >
            Install {newUpdate.version}
          </button>
        )}
        <Link
          to="https://lume.nu"
          className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-neutral-100 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        >
          Website
        </Link>
        <Link
          to="https://github.com/luminous-devs/lume/issues"
          className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-neutral-100 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        >
          Report a issue
        </Link>
      </div>
    </div>
  );
}
