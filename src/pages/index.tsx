import BaseLayout from '@layouts/base';

import { activeAccountAtom } from '@stores/account';

import LumeSymbol from '@assets/icons/Lume';

import { useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useCallback, useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const setActiveAccount = useSetAtom(activeAccountAtom);

  const fetchActiveAccount = useCallback(async () => {
    const { getAccount } = await import('@utils/bindings');
    return await getAccount();
  }, []);

  useEffect(() => {
    fetchActiveAccount()
      .then((res: any) => {
        if (res.length > 0) {
          // update local storage
          setActiveAccount(res[0]);
          // redirect
          router.replace('/init');
        } else {
          router.replace('/onboarding');
        }
      })
      .catch(console.error);
  }, [fetchActiveAccount, setActiveAccount, router]);

  return (
    <div className="relative h-full overflow-hidden">
      {/* dragging area */}
      <div data-tauri-drag-region className="absolute left-0 top-0 z-20 h-16 w-full bg-transparent" />
      {/* end dragging area */}
      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <LumeSymbol className="h-16 w-16 text-black dark:text-white" />
          <div className="text-center">
            <h3 className="text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
              Here&apos;s an interesting fact:
            </h3>
            <p className="font-medium text-zinc-300 dark:text-zinc-600">
              Bitcoin and Nostr can be used by anyone, and no one can stop you!
            </p>
          </div>
        </div>
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 transform">
          <svg
            className="h-5 w-5 animate-spin text-black dark:text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(
  page:
    | string
    | number
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactFragment
    | ReactPortal
) {
  return <BaseLayout>{page}</BaseLayout>;
};
