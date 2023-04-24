import { createContext } from 'react';

export const AccountContext = createContext({});

let activeAccount: any = null;

if (typeof window !== 'undefined') {
  const { getActiveAccount } = await import('@utils/storage');
  activeAccount = await getActiveAccount();
}

export default function AccountProvider({ children }: { children: React.ReactNode }) {
  return <AccountContext.Provider value={activeAccount}>{children}</AccountContext.Provider>;
}
