import { Link } from 'react-router-dom';

import { ArrowRightCircleIcon } from '@shared/icons/arrowRightCircle';

export function WelcomeScreen() {
  return (
    <div className="flex h-screen w-full flex-col justify-between">
      <div className="flex flex-1 items-center justify-center">
        <h1 className="text-5xl font-semibold">Have fun together!</h1>
      </div>
      <div className="flex flex-1 items-end justify-center">
        <div className="inline-flex w-full flex-col gap-3 px-10 pb-10">
          <Link
            to="/auth/import"
            className="inline-flex h-12 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium text-white hover:bg-fuchsia-600"
          >
            <span className="w-5" />
            <span>Login with private key</span>
            <ArrowRightCircleIcon className="h-5 w-5" />
          </Link>
          <Link
            to="/auth/create"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-zinc-800 px-6 font-medium text-zinc-200 hover:bg-zinc-700"
          >
            Create new key
          </Link>
        </div>
      </div>
    </div>
  );
}
