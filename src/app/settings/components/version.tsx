import { getVersion } from '@tauri-apps/api/app';
import { useEffect, useState } from 'react';

export function VersionSetting() {
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    async function checkVersion() {
      const appVersion = await getVersion();
      setVersion(appVersion);
    }
    checkVersion();
  }, []);

  return (
    <div className="inline-flex items-center justify-between px-5 py-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium leading-none text-zinc-200">Version</span>
        <span className="text-sm leading-none text-white/50">
          You&apos;re using latest version
        </span>
      </div>
      <div className="inline-flex items-center gap-2">
        <span className="font-medium text-zinc-300">{version}</span>
      </div>
    </div>
  );
}
