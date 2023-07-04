import { Link } from 'react-router-dom';

import { ArrowRightCircleIcon } from '@shared/icons/arrowRightCircle';

export function WelcomeScreen() {
  return (
    <div className="grid h-full w-full grid-cols-12 gap-4 px-4 py-4">
      <div className="col-span-5 flex flex-col rounded-xl border-t border-zinc-800/50 bg-zinc-900">
        <div className="flex h-full w-full flex-col justify-center gap-2 px-4 py-4">
          <h1 className="text-4xl font-bold leading-none text-transparent text-zinc-700">
            Preserve your <span className="text-fuchsia-300">freedom</span>
          </h1>
          <h2 className="text-4xl font-bold leading-none text-transparent text-zinc-700">
            Protect your <span className="text-red-300">future</span>
          </h2>
          <h3 className="text-4xl font-bold leading-none text-transparent text-zinc-700">
            Stack <span className="text-orange-300">bitcoin</span>
          </h3>
          <h3 className="text-4xl font-bold leading-none text-transparent text-zinc-700">
            Use <span className="text-purple-300">nostr</span>
          </h3>
        </div>
        <div className="mt-auto flex w-full flex-col gap-2 px-4 py-4">
          <Link
            to="/auth/import"
            className="inline-flex h-12 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium text-zinc-100 hover:bg-fuchsia-600"
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
      <div
        className="col-span-5 rounded-xl bg-zinc-900 bg-cover bg-center"
        style={{
          backgroundImage: `url("https://void.cat/d/Ps1b36vu5pdkEA2w75usuB")`,
        }}
      />
      <div
        className="col-span-2 rounded-xl bg-zinc-900 bg-cover bg-center"
        style={{
          backgroundImage: `url("https://void.cat/d/5FdJcBP5ZXKAjYqV8hpcp3")`,
        }}
      />
    </div>
  );
}
