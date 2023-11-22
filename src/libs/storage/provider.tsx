import { message } from '@tauri-apps/plugin-dialog';
import { platform } from '@tauri-apps/plugin-os';
import { relaunch } from '@tauri-apps/plugin-process';
import Database from '@tauri-apps/plugin-sql';
import { check } from '@tauri-apps/plugin-updater';
import Markdown from 'markdown-to-jsx';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { LumeStorage } from '@libs/storage/instance';

import { LoaderIcon } from '@shared/icons';

import { QUOTES } from '@stores/constants';

interface StorageContext {
  db: LumeStorage;
}

const StorageContext = createContext<StorageContext>({
  db: undefined,
});

const StorageInstance = () => {
  const [db, setDB] = useState<LumeStorage>(undefined);
  const [isNewVersion, setIsNewVersion] = useState(false);

  const initLumeStorage = async () => {
    try {
      const sqlite = await Database.load('sqlite:lume_v2.db');
      const platformName = await platform();

      const lumeStorage = new LumeStorage(sqlite, platformName);
      if (!lumeStorage.account) await lumeStorage.getActiveAccount();

      const settings = await lumeStorage.getAllSettings();
      let autoUpdater = false;

      if (settings) {
        settings.forEach((item) => {
          if (item.key === 'outbox') lumeStorage.settings.outbox = !!parseInt(item.value);

          if (item.key === 'media') lumeStorage.settings.media = !!parseInt(item.value);

          if (item.key === 'hashtag')
            lumeStorage.settings.hashtag = !!parseInt(item.value);

          if (item.key === 'autoupdate') {
            if (parseInt(item.value)) autoUpdater = true;
          }
        });
      }

      if (autoUpdater) {
        // check update
        const update = await check();
        // install new version
        if (update) {
          setIsNewVersion(true);

          await update.downloadAndInstall();
          await relaunch();
        }
      }

      setDB(lumeStorage);
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

  return { db, isNewVersion };
};

const StorageProvider = ({ children }: PropsWithChildren<object>) => {
  const { db, isNewVersion } = StorageInstance();

  if (!db)
    return (
      <div
        data-tauri-drag-region
        className="relative flex h-screen w-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950"
      >
        <div className="flex max-w-2xl flex-col items-start gap-1">
          <h5 className="font-semibold uppercase">TIP:</h5>
          <Markdown
            options={{
              overrides: {
                a: {
                  props: {
                    className: 'text-blue-500 hover:text-blue-600',
                    target: '_blank',
                  },
                },
              },
            }}
            className="text-4xl font-semibold leading-snug text-neutral-300 dark:text-neutral-700"
          >
            {QUOTES[Math.floor(Math.random() * QUOTES.length)]}
          </Markdown>
        </div>
        <div className="absolute bottom-5 right-5 inline-flex items-center gap-2.5">
          <LoaderIcon className="h-6 w-6 animate-spin text-blue-500" />
          <p className="font-semibold">
            {isNewVersion ? 'Found a new version, updating...' : 'Starting...'}
          </p>
        </div>
      </div>
    );

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
