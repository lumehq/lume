import { Link } from 'react-router-dom';

export function FinishScreen() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-10">
        <div className="text-center">
          <img src="/icon.png" alt="Lume's logo" className="mx-auto mb-1 h-auto w-16" />
          <h1 className="text-2xl font-light">
            Yo, you&apos;re ready to use <span className="font-bold">Lume</span>
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to="/auth/tutorials/note"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600"
          >
            Start tutorial
          </Link>
          <Link
            to="/"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-neutral-100 font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            Skip
          </Link>
          <p className="mt-2 text-center text-sm font-medium text-neutral-500 dark:text-neutral-600">
            You need to restart app to make changes in previous step take effect or you
            can continue with Lume default settings
          </p>
        </div>
      </div>
    </div>
  );
}
