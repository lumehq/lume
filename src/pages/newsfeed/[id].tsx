import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';

export default function Page() {
  return <div className="scrollbar-hide flex h-full flex-col gap-2 overflow-y-auto py-3"></div>;
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
