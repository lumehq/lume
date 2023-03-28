import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';

export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-sm text-zinc-400">Sorry, this feature under development, it will come in the next version</p>
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
