import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r: any) => r.json());

export const useProfile = (pubkey: string) => {
  const { data, error, isLoading } = useSWR(`https://us.rbr.bio/${pubkey}/metadata.json`, fetcher);

  return {
    user: data ? JSON.parse(data.content ? data.content : null) : null,
    isLoading,
    isError: error,
  };
};
