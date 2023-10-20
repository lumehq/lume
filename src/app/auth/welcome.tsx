import { Link } from 'react-router-dom';

export function WelcomeScreen() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-xs flex-col gap-10">
        <div className="text-center">
          <img src="/icon.png" alt="Lume's logo" className="mx-auto mb-1 h-auto w-16" />
          <h1 className="text-2xl">
            Welcome to <span className="font-semibold">Lume</span>
          </h1>
        </div>
        <div className="flex flex-col gap-2 px-8">
          <Link
            to="/auth/create"
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600"
          >
            Create new account
          </Link>
          <Link
            to="/auth/import"
            className="inline-flex h-10 w-full items-center justify-center rounded-lg font-medium text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
