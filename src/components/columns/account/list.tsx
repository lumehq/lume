import { ActiveAccount } from '@components/columns/account/active';
import { InactiveAccount } from '@components/columns/account/inactive';

import useLocalStorage from '@rehooks/local-storage';
import { useCallback, useEffect, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

export default function AccountList() {
  const [currentUser]: any = useLocalStorage('current-user');
  const [users, setUsers] = useState([]);

  const renderAccount = useCallback(
    (user: { id: string }) => {
      if (user.id === currentUser.id) {
        return <ActiveAccount user={user} />;
      } else {
        return <InactiveAccount user={user} />;
      }
    },
    [currentUser.id]
  );

  const getAccounts = useCallback(async () => {
    const db = await Database.load('sqlite:lume.db');
    const result: any = await db.select('SELECT * FROM accounts');

    setUsers(result);
  }, []);

  useEffect(() => {
    getAccounts().catch(console.error);
  }, [getAccounts]);

  return <>{users.map((user) => renderAccount(user))}</>;
}
