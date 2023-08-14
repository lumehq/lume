import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/tauri';

import { Opengraph } from '@utils/types';

export function useOpenGraph(url: string) {
  const { status, data, error, isFetching } = useQuery(
    ['preview', url],
    async () => {
      const res: Opengraph = await invoke('opengraph', { url });
      if (!res) {
        throw new Error('fetch preview failed');
      }
      return res;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    }
  );

  return {
    status,
    data,
    error,
    isFetching,
  };
}
