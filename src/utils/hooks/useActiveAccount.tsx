import { getActiveAccount } from '@lume/utils/storage';

import useSWR from 'swr';

const fetcher = () => getActiveAccount();

export const useActiveAccount = () => {
  const { data, error, isLoading } = useSWR('activeAcount', fetcher);

  return {
    account: data,
    isLoading,
    isError: error,
  };
};
