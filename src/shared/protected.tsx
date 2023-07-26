import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { LoaderIcon } from '@shared/icons';

import { useStronghold } from '@stores/stronghold';

import { useAccount } from '@utils/hooks/useAccount';

export function Protected({ children }: { children: ReactNode }) {
  const privkey = useStronghold((state) => state.privkey);
  const { status, account } = useAccount();

  if (status === 'loading') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderIcon className="h-6 w-6 animate-spin text-zinc-100" />
      </div>
    );
  }

  if (!account) {
    return <Navigate to="/auth/welcome" replace />;
  }

  if (account && account.privkey.length > 35) {
    return <Navigate to="/auth/migrate" replace />;
  }

  if (account && !privkey) {
    return <Navigate to="/auth/unlock" replace />;
  }

  return children;
}
