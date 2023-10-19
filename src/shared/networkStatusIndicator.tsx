import { twMerge } from 'tailwind-merge';

import { useNetworkStatus } from '@utils/hooks/useNetworkStatus';

export function NetworkStatusIndicator() {
  const isOnline = useNetworkStatus();

  return (
    <span
      className={twMerge(
        'absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-neutral-100 dark:ring-neutral-900',
        isOnline ? 'bg-teal-500' : 'bg-red-500'
      )}
    />
  );
}
