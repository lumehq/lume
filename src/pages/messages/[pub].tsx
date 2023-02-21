import BaseLayout from '@layouts/baseLayout';
import UserLayout from '@layouts/userLayout';

import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';

export default function Page() {
  return <></>;
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
      <UserLayout>{page}</UserLayout>
    </BaseLayout>
  );
};
