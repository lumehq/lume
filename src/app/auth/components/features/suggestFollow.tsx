import { Link } from 'react-router-dom';

export function SuggestFollow() {
  return (
    <div className="rounded-xl bg-neutral-100 p-3 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
      <div className="flex items-start justify-between">
        <div>
          <h5 className="font-semibold">Enrich your network</h5>
          <p className="text-sm">
            Follow more people to stay up to date with everything happening around the
            world.
          </p>
        </div>
        <Link
          to="/auth/onboarding/enrich"
          className="mt-1 inline-flex h-9 w-24 shrink-0 items-center justify-center rounded-lg bg-neutral-200 font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
        >
          Check
        </Link>
      </div>
    </div>
  );
}
