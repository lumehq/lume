import BaseLayout from '@layouts/baseLayout';
import OnboardingLayout from '@layouts/onboardingLayout';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';

export default function Page() {
  return (
    <div className="flex h-full flex-col justify-between px-8">
      <div>{/* spacer */}</div>
      <div className="flex flex-col gap-3">
        <motion.h1
          layoutId="title"
          className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-3xl font-medium text-transparent"
        >
          Other social network require email/password
          <br />
          nostr use{' '}
          <span className="bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 bg-clip-text text-transparent">
            public/private key instead
          </span>
        </motion.h1>
        <motion.h2 layoutId="subtitle" className="w-3/4 text-zinc-400">
          If you have used nostr before, you can import your own private key. Otherwise, you can create a new key or use
          auto-generated account created by system.
        </motion.h2>
        <motion.div layoutId="form"></motion.div>
        <motion.div layoutId="action" className="mt-4 flex gap-2">
          <Link
            href="/onboarding/create"
            className="hover:bg-zinc-900/2.5 transform rounded-lg border border-black/5 bg-zinc-800 px-3.5 py-2 font-medium ring-1 ring-inset ring-zinc-900/10 hover:text-zinc-900 active:translate-y-1 dark:text-zinc-300 dark:ring-white/10 dark:hover:bg-zinc-700 dark:hover:text-white"
          >
            Create new key
          </Link>
          <Link
            href="/onboarding/login"
            className="hover:bg-zinc-900/2.5 transform rounded-lg border border-black/5 bg-zinc-800 px-3.5 py-2 font-medium ring-1 ring-inset ring-zinc-900/10 hover:text-zinc-900 active:translate-y-1 dark:text-zinc-300 dark:ring-white/10 dark:hover:bg-zinc-700 dark:hover:text-white"
          >
            Login with private key
          </Link>
        </motion.div>
      </div>
      <div>{/* spacer */}</div>
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
      <OnboardingLayout>{page}</OnboardingLayout>
    </BaseLayout>
  );
};
