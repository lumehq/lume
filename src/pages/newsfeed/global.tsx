import BaseLayout from '@layouts/base';
import NewsFeedLayout from '@layouts/newsfeed';

import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';

export default function Page() {
  return (
    <div className="h-full w-full">
      <p>Global</p>
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
      <NewsFeedLayout>{page}</NewsFeedLayout>
    </BaseLayout>
  );
};
