import { ask } from '@tauri-apps/plugin-dialog';
import { platform } from '@tauri-apps/plugin-os';
import { relaunch } from '@tauri-apps/plugin-process';
import Database from '@tauri-apps/plugin-sql';
import { check } from '@tauri-apps/plugin-updater';
import Markdown from 'markdown-to-jsx';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Ark } from '@libs/ark';
import { LoaderIcon } from '@shared/icons';
import { QUOTES } from '@utils/constants';
import { delay } from '@utils/delay';

const ArkContext = createContext<Ark>(undefined);

const ArkProvider = ({ children }: PropsWithChildren<object>) => {
  const [ark, setArk] = useState<Ark>(undefined);
  const [isNewVersion, setIsNewVersion] = useState(false);

  async function initArk() {
    try {
      const sqlite = await Database.load('sqlite:lume_v2.db');
      const platformName = await platform();

      const _ark = new Ark({ storage: sqlite, platform: platformName });
      await _ark.init();

      // check update
      if (_ark.settings.autoupdate) {
        const update = await check();
        // install new version
        if (update) {
          setIsNewVersion(true);

          await update.downloadAndInstall();
          await relaunch();
        }
      }

      // start depot
      if (_ark.settings.depot) {
        await _ark.launchDepot();
        await delay(2000);
      }

      setArk(_ark);
    } catch (e) {
      console.error(e);
      const yes = await ask(`${e}. Click "Yes" to relaunch app`, {
        title: 'Lume',
        type: 'error',
        okLabel: 'Yes',
      });
      if (yes) relaunch();
    }
  }

  useEffect(() => {
    if (!ark && !isNewVersion) initArk();
  }, []);

  if (!ark) {
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
  }

  return <ArkContext.Provider value={ark}>{children}</ArkContext.Provider>;
};

const useArk = () => {
  const context = useContext(ArkContext);
  if (context === undefined) {
    throw new Error('Please import Ark Provider to use useArk() hook');
  }
  return context;
};

export { ArkProvider, useArk };
