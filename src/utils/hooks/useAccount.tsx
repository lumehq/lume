import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { getActiveAccount } from '@libs/storage';

export function useAccount() {
  const { ndk } = useNDK();
  const { status, data: account } = useQuery(
    ['currentAccount'],
    async () => {
      const account = await getActiveAccount();
      console.log('active account: ', account);
      if (account?.pubkey) {
        const user = ndk.getUser({ hexpubkey: account?.pubkey });
        await user.fetchProfile();
        return { ...account, ...user.profile };
      }
      return account;
    },
    {
      enabled: !!ndk,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return { status, account };
}
