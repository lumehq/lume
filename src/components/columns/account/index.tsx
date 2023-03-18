import { Account } from '@components/columns/account/account';

import LumeSymbol from '@assets/icons/Lume';
import { PlusIcon } from '@radix-ui/react-icons';
import { getVersion } from '@tauri-apps/api/app';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

export default function AccountColumn() {
  const [users, setUsers] = useState([]);
  const [version, setVersion] = useState(null);

  const getAccounts = useCallback(async () => {
    const db = await Database.load('sqlite:lume.db');
    const result: any = await db.select('SELECT * FROM accounts');

    setUsers(result);
  }, []);

  const getAppVersion = useCallback(async () => {
    const appVersion = await getVersion();
    setVersion(appVersion);
  }, []);

  useEffect(() => {
    getAccounts().catch(console.error);
    getAppVersion().catch(console.error);
  }, [getAccounts, getAppVersion]);

  return (
    <div className="flex h-full flex-col items-center justify-between px-2 pt-4 pb-4">
      <div className="flex flex-col gap-4">
        <Link
          href="/explore"
          className="group relative flex h-11 w-11 shrink cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-zinc-900 hover:bg-zinc-800"
        >
          <LumeSymbol className="h-6 w-auto text-zinc-400 group-hover:text-zinc-200" />
        </Link>
        {users.map((user, index) => (
          <Account key={index} user={user} />
        ))}
        <Link
          href="/onboarding"
          className="group relative flex h-11 w-11 shrink cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-zinc-600 hover:border-zinc-400"
        >
          <PlusIcon className="h-4 w-4 text-zinc-400 group-hover:text-zinc-200" />
        </Link>
      </div>
      <div className="flex flex-col gap-0.5 text-center">
        <span className="bg-gradient-to-r from-fuchsia-300 via-orange-100 to-amber-300 bg-clip-text text-sm font-black uppercase leading-tight text-transparent">
          Lume
        </span>
        <span className="text-xs font-medium text-zinc-700">v{version}</span>
      </div>
    </div>
  );
}
