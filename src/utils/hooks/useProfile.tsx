import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r: any) => r.json());

export const useProfile = (pubkey: string) => {
  const { data, error } = useSWR(`https://rbr.bio/${pubkey}/metadata.json`, fetcher);
  if (error) {
    return error;
  }
  if (data) {
    return JSON.parse(data.content);
  }
  return null;
};
