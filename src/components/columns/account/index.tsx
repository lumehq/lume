import AccountList from '@components/columns/account/list';

import LumeSymbol from '@assets/icons/Lume';

import { PlusIcon } from '@radix-ui/react-icons';
import { getVersion } from '@tauri-apps/api/app';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function AccountColumn() {
  const [version, setVersion] = useState(null);

  const getAppVersion = useCallback(async () => {
    const appVersion = await getVersion();
    setVersion(appVersion);
  }, []);

  useEffect(() => {
    getAppVersion().catch(console.error);
  }, [getAppVersion]);

  return (
    <div className="flex h-full flex-col items-center justify-between px-2 pt-4 pb-4">
      <div className="flex flex-col gap-4">
        <Link
          href="/explore"
          className="group relative flex h-11 w-11 shrink cursor-pointer items-center justify-center rounded-md bg-zinc-900 hover:bg-zinc-800"
        >
          <LumeSymbol className="h-6 w-auto text-zinc-400 group-hover:text-zinc-200" />
        </Link>
        <AccountList />
        <Link
          href="/onboarding"
          className="group relative flex h-11 w-11 shrink cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-zinc-600 hover:border-zinc-400"
        >
          <PlusIcon className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200" />
        </Link>
      </div>
      <div className="flex flex-col gap-0.5 text-center">
        <span className="animate-moveBg from-fuchsia-300 via-orange-100 to-amber-300 text-sm font-black uppercase leading-tight text-zinc-600 hover:bg-gradient-to-r hover:bg-clip-text hover:text-transparent">
          Lume
        </span>
        <span className="text-xs font-medium text-zinc-700">v{version}</span>
      </div>
    </div>
  );
}
