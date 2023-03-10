import { deleteFromStorage, writeStorage } from '@rehooks/local-storage';
import { createContext, useCallback, useEffect, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

export const DatabaseContext = createContext({});

const db = typeof window !== 'undefined' ? await Database.load('sqlite:lume.db') : null;

export default function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);

  const getRelays = useCallback(async () => {
    const result: any[] = await db.select('SELECT relay_url FROM relays WHERE relay_status = "1"');
    const arr = [];
    result.forEach((item: { relay_url: string }) => {
      arr.push(item.relay_url);
    });
    // delete old item then save new item to local storage
    deleteFromStorage('relays');
    writeStorage('relays', arr);
    // return
    return;
  }, []);

  const getAccount = useCallback(async () => {
    const result = await db.select(`SELECT * FROM accounts LIMIT 1`);
    // delete old item then save new item to local storage
    deleteFromStorage('current-user');
    if (result[0]) {
      writeStorage('current-user', result[0]);
    } else {
      writeStorage('current-user', null);
    }
    // return first record
    return result[0];
  }, []);

  const getFollows = useCallback(async (id: string) => {
    const result: any[] = await db.select(`SELECT pubkey FROM follows WHERE account = "${id}"`);
    const arr = [];
    result.forEach((item: { pubkey: string }) => {
      arr.push(item.pubkey);
    });
    // delete old item then save new item to local storage
    deleteFromStorage('follows');
    writeStorage('follows', arr);
    // return
    return;
  }, []);

  useEffect(() => {
    getRelays().catch(console.error);
    getAccount()
      .then((res) => {
        if (res) {
          getFollows(res.id).catch(console.error);
        }
        setDone(true);
      })
      .catch(console.error);
  }, [getAccount, getFollows, getRelays]);

  if (!done) {
    return <></>;
  }

  return <DatabaseContext.Provider value={{ db }}>{children}</DatabaseContext.Provider>;
}
