import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/primitives';
import { Opengraph } from '@utils/types';

export function useOpenGraph(url: string) {
  const { status, data, error } = useQuery({
    queryKey: ['opg', url],
    queryFn: async () => {
      const res: Opengraph = await invoke('opengraph', { url });
      if (!res) {
        throw new Error('fetch preview failed');
      }
      return res;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    status,
    data,
    error,
  };
}
