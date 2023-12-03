import { Link } from 'react-router-dom';

export function TutorialFinishScreen() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-10">
        <div className="text-center">
          <img src="/icon.png" alt="Lume's logo" className="mx-auto mb-1 h-auto w-16" />
          <h1 className="text-2xl font-light">
            Yo, you&apos;ve understood basic features 🎉
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to="/"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600"
          >
            Start using
          </Link>
          <Link
            to="https://nostr.how/"
            target="_blank"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-neutral-100 font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            Learn more about Nostr
          </Link>
          <p className="text-center text-sm font-medium text-neutral-500 dark:text-neutral-600">
            If you&apos;ve trouble when user Lume, you can report the issue{' '}
            <a
              href="github.com/luminous-devs/lume"
              target="_blank"
              className="text-blue-500 !underline"
            >
              here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
