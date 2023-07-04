import { useNetworkStatus } from '@utils/hooks/useNetworkStatus';

export function NetworkStatusIndicator() {
  const isOnline = useNetworkStatus();

  return (
    <span
      className={`absolute right-0 top-0 block h-2 w-2 -translate-y-1/2 translate-x-1/2 transform rounded-full ${
        isOnline ? 'bg-green-400' : 'bg-red-400'
      } ring-2 ring-zinc-900`}
    />
  );
}
