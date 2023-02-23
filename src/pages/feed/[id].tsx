/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import UserLayout from '@layouts/userLayout';

import { GetStaticPaths } from 'next';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';

export default function Page({ id }: { id: string }) {
  return <div>{id}</div>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export async function getStaticProps(context) {
  const id = context.params.id;
  return {
    props: { id },
  };
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
