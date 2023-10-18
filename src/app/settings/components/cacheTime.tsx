import { useState } from 'react';

import { CheckCircleIcon } from '@shared/icons';

export function CacheTimeSetting() {
  const [time, setTime] = useState('0');

  const update = async () => {
    // await updateSetting('cache_time', time);
  };

  return (
    <div className="inline-flex items-center justify-between px-5 py-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium leading-none text-neutral-200">
          Cache time (milliseconds)
        </span>
        <span className="text-sm leading-none text-white/50">
          The length of time before inactive data gets removed from the cache
        </span>
      </div>
      <div className="inline-flex items-center gap-2">
        <input
          value={time}
          onChange={(e) => setTime(e.currentTarget.value)}
          autoCapitalize="none"
          autoCorrect="none"
          className="h-8 w-24 rounded-md bg-neutral-800 px-2 text-right font-medium text-neutral-300 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => update()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800 font-medium hover:bg-blue-600"
        >
          <CheckCircleIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}
