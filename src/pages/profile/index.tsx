import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import useLocalStorage from '@rehooks/local-storage';
import { useRouter } from 'next/router';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  const [currentUser]: any = useLocalStorage('current-user');

  return (
    <div className="h-full w-full">
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
