import { appConfigDir } from '@tauri-apps/api/path';
import { message } from '@tauri-apps/plugin-dialog';
import { platform } from '@tauri-apps/plugin-os';
import Database from '@tauri-apps/plugin-sql';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { LumeStorage } from '@libs/storage/instance';

interface StorageContext {
  db: LumeStorage;
}

const StorageContext = createContext<StorageContext>({
  db: undefined,
});

const StorageProvider = ({ children }: PropsWithChildren<object>) => {
  const [db, setDB] = useState<LumeStorage>(undefined);

  const initLumeStorage = async () => {
    try {
      const sqlite = await Database.load('sqlite:lume.db');
      const platformName = await platform();
      const dir = await appConfigDir();

      const lumeStorage = new LumeStorage(sqlite, platformName);
      if (!lumeStorage.account) await lumeStorage.getActiveAccount();

      setDB(lumeStorage);
      console.info(dir);
    } catch (e) {
      await message(`Cannot initialize database: ${e}`, {
        title: 'Lume',
        type: 'error',
      });
    }
  };

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
