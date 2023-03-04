/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import FullLayout from '@layouts/fullLayout';

import LumeSymbol from '@assets/icons/Lume';
import { useLocalStorage } from '@rehooks/local-storage';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();

  const [currentUser]: any = useLocalStorage('current-user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setTimeout(() => {
        setLoading(false);
        router.push('/onboarding');
      }, 1500);
    } else {
      setTimeout(() => {
        setLoading(false);
        router.push('/feed/following');
      }, 1500);
    }
  }, [currentUser, router]);

  return (
    <div className="relative flex h-full flex-col items-center justify-between">
      <div>{/* spacer */}</div>
      <div className="flex flex-col items-center gap-4">
        <motion.div layoutId="logo" className="relative">
          <LumeSymbol className="h-16 w-16 text-white" />
        </motion.div>
        <div className="flex flex-col items-center gap-0.5">
          <motion.h2
            layoutId="subtitle"
            className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-4xl font-medium text-transparent"
          >
            A censorship-resistant social network
          </motion.h2>
          <motion.h1
            layoutId="title"
            className="bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 bg-clip-text text-5xl font-bold text-transparent"
          >
            built on nostr
          </motion.h1>
        </div>
      </div>
      <div className="flex items-center gap-2 pb-16">
        <div className="h-10">
          {loading ? (
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* background */}
      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-400/10 to-orange-100/10 opacity-100 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
        <svg
          aria-hidden="true"
          className="dark:fill-white/2.5 absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:stroke-white/5"
        >
          <defs>
            <pattern id=":R11d6:" width="72" height="56" patternUnits="userSpaceOnUse" x="-12" y="4">
              <path d="M.5 56V.5H72" fill="none"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#:R11d6:)"></rect>
          <svg x="-12" y="4" className="overflow-visible">
            <rect strokeWidth="0" width="73" height="57" x="288" y="168"></rect>
            <rect strokeWidth="0" width="73" height="57" x="144" y="56"></rect>
            <rect strokeWidth="0" width="73" height="57" x="504" y="168"></rect>
            <rect strokeWidth="0" width="73" height="57" x="720" y="336"></rect>
          </svg>
        </svg>
      </div>
      {/* end background */}
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
      <FullLayout>{page}</FullLayout>
    </BaseLayout>
  );
};
