import { ActiveAccount } from '@components/columns/account/active';
import { InactiveAccount } from '@components/columns/account/inactive';

import { activeAccountAtom } from '@stores/account';

import { getAccounts } from '@utils/storage';

import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

export default function AccountList() {
  const activeAccount: any = useAtomValue(activeAccountAtom);
  const [users, setUsers] = useState([]);

  const renderAccount = useCallback(
    (user: { id: string }) => {
      if (user.id === activeAccount.id) {
        return <ActiveAccount key={user.id} user={user} />;
      } else {
        return <InactiveAccount key={user.id} user={user} />;
      }
    },
    [activeAccount.id]
  );

  useEffect(() => {
    const fetchAccount = async () => {
      const result: any = await getAccounts();
      setUsers(result);
    };

    fetchAccount().catch(console.error);
  }, []);

  return <>{users.map((user) => renderAccount(user))}</>;
}
