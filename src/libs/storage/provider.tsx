import { message } from '@tauri-apps/api/dialog';
import { platform } from '@tauri-apps/api/os';
import { appConfigDir } from '@tauri-apps/api/path';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

import { LumeStorage } from '@libs/storage/instance';

interface StorageContext {
  db: LumeStorage;
}

const StorageContext = createContext<StorageContext>({
  db: undefined,
});

const StorageProvider = ({ children }: PropsWithChildren<object>) => {
  const [db, setDB] = useState<LumeStorage>(undefined);

  async function initLumeStorage() {
    try {
      const dir = await appConfigDir();
      const sqlite = await Database.load('sqlite:lume.db');
      const platformName = await platform();
      const lumeStorage = new LumeStorage(sqlite, platformName);

      console.log('App config dir: ', dir);

      if (!lumeStorage.account) await lumeStorage.getActiveAccount();
      setDB(lumeStorage);
    } catch (e) {
      await message(`Cannot initialize database: ${e}`, {
        title: 'Lume',
        type: 'error',
      });
    }
  }

  useEffect(() => {
    if (!db) initLumeStorage();
  }, []);

  if (db) {
    return <StorageContext.Provider value={{ db }}>{children}</StorageContext.Provider>;
  }
};

const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('Storage not found');
  }
  return context;
};

export { StorageProvider, useStorage };
