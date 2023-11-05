import { appConfigDir } from '@tauri-apps/api/path';
import { message } from '@tauri-apps/plugin-dialog';
import { platform } from '@tauri-apps/plugin-os';
import { relaunch } from '@tauri-apps/plugin-process';
import Database from '@tauri-apps/plugin-sql';
import { check } from '@tauri-apps/plugin-updater';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { LumeStorage } from '@libs/storage/instance';

import { LoaderIcon } from '@shared/icons';

interface StorageContext {
  db: LumeStorage;
}

const StorageContext = createContext<StorageContext>({
  db: undefined,
});

const StorageProvider = ({ children }: PropsWithChildren<object>) => {
  const [db, setDB] = useState<LumeStorage>(undefined);
  const [isNewVersion, setIsNewVersion] = useState(false);

  const initLumeStorage = async () => {
    try {
      const sqlite = await Database.load('sqlite:lume_v2.db');
      const platformName = await platform();
      const dir = await appConfigDir();

      const lumeStorage = new LumeStorage(sqlite, platformName);
      if (!lumeStorage.account) await lumeStorage.getActiveAccount();

      // check update
      const update = await check();
      if (update) {
        setIsNewVersion(true);

        await update.downloadAndInstall();
        await relaunch();
      }

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

  if (!db) {
    return (
      <div
        data-tauri-drag-region
        className="flex h-screen w-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950"
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-xl font-medium">
            {isNewVersion ? 'Found a new version, updating' : 'Checking for updates...'}
          </p>
          <LoaderIcon className="h-7 w-7 animate-spin" />
        </div>
      </div>
    );
  }

  return <StorageContext.Provider value={{ db }}>{children}</StorageContext.Provider>;
};

const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('Storage not found');
  }
  return context;
};

export { StorageProvider, useStorage };
