'use client';

import { ActiveAccount } from '@components/multiAccounts/activeAccount';
import { InactiveAccount } from '@components/multiAccounts/inactiveAccount';

import { APP_VERSION } from '@stores/constants';

import { getAccounts } from '@utils/storage';

import LumeSymbol from '@assets/icons/Lume';

import useLocalStorage from '@rehooks/local-storage';
import { Plus } from 'iconoir-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function MultiAccounts() {
  const [users, setUsers] = useState([]);
  const [activeAccount]: any = useLocalStorage('account', {});

  const renderAccount = useCallback(
    (user: { pubkey: string }) => {
      if (user.pubkey === activeAccount.pubkey) {
        return <ActiveAccount key={user.pubkey} user={user} />;
      } else {
        return <InactiveAccount key={user.pubkey} user={user} />;
      }
    },
    [activeAccount.pubkey]
  );

  useEffect(() => {
    getAccounts()
      .then((res: any) => setUsers(res))
      .catch(console.error);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-between px-2 pb-4 pt-3">
      <div className="flex flex-col gap-4">
        <Link
          prefetch={false}
          href="/explore"
          className="group relative flex h-11 w-11 shrink cursor-pointer items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800"
        >
          <LumeSymbol className="h-6 w-auto text-zinc-400 group-hover:text-zinc-200" />
        </Link>
        <div>{users.map((user) => renderAccount(user))}</div>
        <Link
          prefetch={false}
          href="/onboarding"
          className="group relative flex h-11 w-11 shrink cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-600 hover:border-zinc-400"
        >
          <Plus width={16} height={16} className="text-zinc-400 group-hover:text-zinc-200" />
        </Link>
      </div>
      <div className="flex flex-col gap-0.5 text-center">
        <span className="animate-moveBg from-fuchsia-300 via-orange-100 to-amber-300 text-sm font-black uppercase leading-tight text-zinc-600 hover:bg-gradient-to-r hover:bg-clip-text hover:text-transparent">
          Lume
        </span>
        <span className="text-xs font-medium text-zinc-700">v{APP_VERSION}</span>
      </div>
    </div>
  );
}
