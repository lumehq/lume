import { Link } from 'react-router-dom';

import { BellIcon, HomeIcon, PlusIcon } from '@shared/icons';

export function TutorialWidgetScreen() {
  return (
    <div className="flex h-full w-full select-text items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-10">
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
            <HomeIcon className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-light">
            The concept of <span className="font-bold">Widgets</span>
          </h1>
        </div>
        <div className="flex flex-col gap-2 px-3">
          <p>
            Lume provides multiple widgets based on usage. You always can control what you
            need to show on your Home.
          </p>
          <p className="font-semibold">Default widgets:</p>
          <div className="inline-flex gap-3">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
              <HomeIcon className="h-5 w-5" />
            </div>
            <p>Newsfeed - You can view notes from accounts you follow.</p>
          </div>
          <div className="inline-flex gap-3">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
              <BellIcon className="h-5 w-5" />
            </div>
            <p>Notification - You can view all notifications related to your account.</p>
          </div>
          <p>
            If you want to add more widget, you can click to this button on Home Screen.
          </p>
          <div className="flex h-24 w-full items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
            <button
              type="button"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-5 flex gap-2">
            <Link
              to="/auth/tutorials/note"
              className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-neutral-100 font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            >
              Back
            </Link>
            <Link
              to="/auth/tutorials/posting"
              className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
