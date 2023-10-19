import { appConfigDir } from '@tauri-apps/api/path';
import { useEffect, useState } from 'react';

export function DataPath() {
  const [path, setPath] = useState<string>('');

  useEffect(() => {
    async function getPath() {
      const dir = await appConfigDir();
      setPath(dir);
    }
    getPath();
  }, []);

  return (
    <div className="inline-flex items-center justify-between px-5 py-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium leading-none text-neutral-200">App data path</span>
        <span className="text-sm leading-none text-neutral-600 dark:text-neutral-400">
          Where the local data is stored
        </span>
      </div>
      <div className="inline-flex items-center gap-2">
        <span className="font-medium text-neutral-300">{path}</span>
      </div>
    </div>
  );
}
