/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';

import { GetStaticPaths } from 'next';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';

export default function Page({ pubkey }: { pubkey: string }) {
  return <div>{pubkey}</div>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export async function getStaticProps(context) {
  const pubkey = context.params.pubkey;
  return {
    props: { pubkey },
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
  return <BaseLayout>{page}</BaseLayout>;
};
