import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

export function useAccount() {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, data: account } = useQuery(
    ['account'],
    async () => {
      const account = await db.getActiveAccount();
      console.log('account: ', account);
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
