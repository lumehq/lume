import { Link } from 'react-router-dom';

import { ArrowRightCircleIcon } from '@shared/icons/arrowRightCircle';

export function WelcomeScreen() {
  return (
    <div className="mx-auto flex h-screen w-full max-w-md flex-col justify-center">
      <div className="flex flex-col gap-10 pt-16">
        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-3xl font-semibold text-white">Welcome to Lume</h1>
          <p className="mx-auto w-2/3 leading-tight text-white/50">
            Let&apos;s get you up and connecting with all peoples around the world on
            Nostr
          </p>
        </div>
        <div className="inline-flex w-full flex-col items-center gap-3 px-4 pb-10">
          <Link
            to="/auth/import"
            className="inline-flex h-12 w-3/4 items-center justify-between gap-2 rounded-lg border-t border-white/10 bg-interor-500 px-4 font-medium leading-none text-white hover:bg-interor-600 focus:outline-none"
          >
            <span className="w-5" />
            <span>Login with private key</span>
            <ArrowRightCircleIcon className="h-5 w-5" />
          </Link>
          <Link
            to="/auth/create"
            className="inline-flex h-12 w-3/4 items-center justify-center gap-2 rounded-lg border-t border-white/10 bg-white/20 font-medium leading-none text-white backdrop-blur-xl hover:bg-white/30 focus:outline-none"
          >
            Create new key
          </Link>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 transform">
        <img src="/lume.png" alt="lume" className="mx-auto h-auto w-1/4" />
      </div>
    </div>
  );
}
