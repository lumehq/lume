import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useOnboarding } from '@stores/onboarding';
import { useStronghold } from '@stores/stronghold';

export function AuthImportScreen() {
  const [step, tmpPrivkey] = useOnboarding((state) => [state.step, state.tempPrivkey]);
  const setPrivkey = useStronghold((state) => state.setPrivkey);

  useEffect(() => {
    if (step) {
      setPrivkey(tmpPrivkey);
    }
  }, [tmpPrivkey]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Outlet />
    </div>
  );
}
