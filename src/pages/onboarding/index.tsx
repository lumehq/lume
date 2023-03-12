import BaseLayout from '@layouts/base';

import { ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';

export default function Page() {
  return (
    <div className="grid h-full w-full grid-rows-5">
      <div className="row-span-3 overflow-hidden p-4"></div>
      <div className="row-span-2 flex w-full flex-col items-center gap-8 overflow-hidden pt-10">
        <h1 className="animate-moveBg bg-gradient-to-r from-fuchsia-300 via-orange-100 to-amber-300 bg-clip-text text-5xl font-bold leading-none text-transparent">
          Let&apos;s start!
        </h1>
        <div className="mt-4 flex flex-col items-center gap-1.5">
          <Link
            href="/onboarding/create"
            className="relative inline-flex h-14 w-64 items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-lg font-medium ring-1 ring-zinc-800 hover:bg-zinc-800"
          >
            Create new key
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
          <Link
            href="/onboarding/login"
            className="inline-flex h-14 w-64 items-center justify-center gap-2 rounded-full px-6 text-base font-medium text-zinc-300 hover:bg-zinc-800"
          >
            Login with private key
          </Link>
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
