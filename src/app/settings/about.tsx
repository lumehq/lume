import { getVersion } from '@tauri-apps/api/app';
import { useEffect, useState } from 'react';

export function AboutScreen() {
  const [version, setVersion] = useState('');

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
          <p className="text-neutral-700 dark:text-neutral-300">Version {version}</p>
        </div>
      </div>
    </div>
  );
}
