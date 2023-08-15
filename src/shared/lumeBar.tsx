import { Link } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { ActiveAccount } from '@shared/accounts/active';
import { SettingsIcon } from '@shared/icons';
import { Logout } from '@shared/logout';
import { NotificationModal } from '@shared/notification/modal';

export function LumeBar() {
  const { db } = useStorage();

  return (
    <div className="rounded-xl bg-white/10 p-2 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <ActiveAccount data={db.account} />
        <NotificationModal pubkey={db.account.pubkey} />
        <Link
          to="/settings/general"
          className="inline-flex h-9 w-9 transform items-center justify-center rounded-md bg-white/20 active:translate-y-1"
        >
          <SettingsIcon className="h-4 w-4 text-white" />
        </Link>
        <Logout />
      </div>
    </div>
  );
}
