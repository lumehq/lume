import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useStronghold } from '@stores/stronghold';

import { useAccount } from '@utils/hooks/useAccount';

export function Protected({ children }: { children: ReactNode }) {
  const password = useStronghold((state) => state.password);
  const { status, account } = useAccount();

  if (status === 'success' && !account) {
    return <Navigate to="/auth/welcome" replace />;
  }

  if (status === 'success' && account && !password) {
    return <Navigate to="/auth/unlock" replace />;
  }

  return children;
}
