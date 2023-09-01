import { message } from '@tauri-apps/plugin-dialog';
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

  async function initLumeStorage() {
    try {
      const sqlite = await Database.load('sqlite:lume.db');
      const lumeStorage = new LumeStorage(sqlite);

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
