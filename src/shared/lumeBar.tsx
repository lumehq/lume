import { Link } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { ActiveAccount } from '@shared/accounts/active';
import { SettingsIcon } from '@shared/icons';
import { Logout } from '@shared/logout';

export function LumeBar() {
  const { db } = useStorage();

  return (
    <div className="absolute bottom-3 left-1/2 w-max -translate-x-1/2 transform">
      <div className="rounded-xl bg-white/10 p-2 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <ActiveAccount data={db.account} />
          <Link
            to="/settings/general"
            className="inline-flex h-9 w-9 transform items-center justify-center rounded-md bg-white/20 active:translate-y-1"
          >
            <SettingsIcon className="h-4 w-4 text-white" />
          </Link>
          <Logout />
        </div>
      </div>
    </div>
  );
}
