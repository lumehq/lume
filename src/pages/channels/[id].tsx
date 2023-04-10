import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { RelayContext } from '@components/relaysProvider';

import { useRouter } from 'next/router';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useEffect } from 'react';

export default function Page() {
  const [pool, relays]: any = useContext(RelayContext);

  const router = useRouter();
  const id: string | string[] = router.query.id || null;

  useEffect(() => {
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [42],
          since: 0,
        },
      ],
      relays,
      (event: any) => {
        console.log(event);
      }
    );

    return () => {
      unsubscribe;
    };
  }, [pool, relays]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <p>{id}</p>
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
  return (
    <BaseLayout>
      <WithSidebarLayout>{page}</WithSidebarLayout>
    </BaseLayout>
  );
};
