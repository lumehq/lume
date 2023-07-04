import { useState } from 'react';

import { getSetting, updateSetting } from '@libs/storage';

import { CheckCircleIcon } from '@shared/icons';

const setting = await getSetting('cache_time');
const cacheTime = setting;

export function CacheTimeSetting() {
  const [time, setTime] = useState(cacheTime);

  const update = async () => {
    await updateSetting('cache_time', time);
  };

  return (
    <div className="inline-flex items-center justify-between px-5 py-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium leading-none text-zinc-200">Cache time</span>
        <span className="text-sm leading-none text-zinc-400">
          The length of time before inactive data gets removed from the cache
        </span>
      </div>
      <div className="inline-flex items-center gap-2">
        <input
          value={time}
          onChange={(e) => setTime(e.currentTarget.value)}
          autoCapitalize="none"
          autoCorrect="none"
          className="h-8 w-24 rounded-md bg-zinc-800 px-2 text-right font-medium text-zinc-300 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => update()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 font-medium hover:bg-fuchsia-500"
        >
          <CheckCircleIcon className="h-4 w-4 text-zinc-100" />
        </button>
      </div>
    </div>
  );
}
