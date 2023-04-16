import { useNetworkStatus } from '@utils/hooks/useNetworkStatus';

export const NetworkStatusIndicator = () => {
  const isOnline = useNetworkStatus();

  return (
    <div className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-zinc-900">
      <div className="relative flex h-1.5 w-1.5">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
            isOnline ? 'bg-green-400' : 'bg-red-400'
          }`}
        ></span>
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-green-400' : 'bg-amber-400'}`}
        ></span>
      </div>
      <p className="text-xs font-medium text-zinc-500">{isOnline ? 'Online' : 'Offline'}</p>
    </div>
  );
};
