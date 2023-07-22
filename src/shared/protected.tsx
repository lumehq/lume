import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useStronghold } from '@stores/stronghold';

import { useAccount } from '@utils/hooks/useAccount';

export function Protected({ children }: { children: ReactNode }) {
  const privkey = useStronghold((state) => state.privkey);
  const { status, account } = useAccount();

  if (status === 'success' && !account) {
    return <Navigate to="/auth/welcome" replace />;
  }

  if (status === 'success' && account && account.privkey.length > 35) {
    return <Navigate to="/auth/migrate" replace />;
  }

  if (status === 'success' && account && !privkey) {
    return <Navigate to="/auth/unlock" replace />;
  }

  return children;
}
