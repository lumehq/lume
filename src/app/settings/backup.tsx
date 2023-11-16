import { useEffect, useState } from 'react';

import { useStorage } from '@libs/storage/provider';

export function BackupSettingScreen() {
  const { db } = useStorage();
  const [privkey, setPrivkey] = useState(null);

  useEffect(() => {
    async function loadPrivkey() {
      const key = await db.secureLoad(db.account.pubkey);
      if (key) setPrivkey(key);
    }

    loadPrivkey();
  }, []);

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-2 text-sm font-semibold">Private key</div>
      <div>
        {!privkey ? (
          <div className="inline-flex h-24 w-full items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
            You&apos;ve stored private key on Lume
          </div>
        ) : (
          <textarea
            readOnly
            className="relative h-36 w-full resize-none rounded-lg bg-neutral-200 px-3 py-1 text-neutral-900 !outline-none placeholder:text-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-400"
          >
            {privkey}
          </textarea>
        )}
      </div>
    </div>
  );
}
