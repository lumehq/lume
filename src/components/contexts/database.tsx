import { writeStorage } from '@rehooks/local-storage';
import { createContext, useEffect, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

export const DatabaseContext = createContext({});

const db = typeof window !== 'undefined' ? await Database.load('sqlite:lume.db') : null;

export default function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const getRelays = async () => {
      const arr = [];
      const result: any[] = await db.select('SELECT relay_url FROM relays WHERE relay_status = "1"');

      result.forEach((item: { relay_url: string }) => {
        arr.push(item.relay_url);
      });

      writeStorage('relays', arr);
    };

    const getAccount = async () => {
      const result = await db.select(`SELECT * FROM accounts LIMIT 1`);
      writeStorage('current-user', result[0]);

      return result[0];
    };

    const getFollows = async (id: string) => {
      const arr = [];
      const result: any[] = await db.select(`SELECT pubkey FROM follows WHERE account = "${id}"`);

      result.forEach((item: { pubkey: string }) => {
        arr.push(item.pubkey);
      });

      writeStorage('follows', arr);
    };

    getRelays().catch(console.error);
    getAccount()
      .then((res) => {
        if (res) {
          getFollows(res.id).catch(console.error);
        }
        setDone(true);
      })
      .catch(console.error);
  }, []);

  if (done === true) {
    return <DatabaseContext.Provider value={{ db }}>{children}</DatabaseContext.Provider>;
  }
}
