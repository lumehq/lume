import { useQuery } from '@tanstack/react-query';

import { getLinkPreview } from '@libs/openGraph';

export function useOpenGraph(url: string) {
  const { status, data, error, isFetching } = useQuery(
    ['preview', url],
    async () => {
      const res = await getLinkPreview(url);
      if (!res) {
        throw new Error("Can' fetch");
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
