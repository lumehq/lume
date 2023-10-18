import { Link } from 'react-router-dom';

import { CheckCircleIcon } from '@shared/icons';

import { useOnboarding } from '@stores/onboarding';

export function FavoriteHashtag() {
  const hashtag = useOnboarding((state) => state.hashtag);

  return (
    <div className="rounded-xl bg-neutral-100 p-3 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
      <div className="flex items-start justify-between">
        <div>
          <h5 className="font-semibold">Favorite hashtag</h5>
          <p className="text-sm">
            By adding favorite hashtag, Lume will display all contents related to this
            hashtag as a column
          </p>
        </div>
        {hashtag ? (
          <div className="mt-1 inline-flex h-9 w-24 shrink-0 items-center justify-center rounded-lg bg-teal-500 text-white">
            <CheckCircleIcon className="h-4 w-4" />
          </div>
        ) : (
          <Link
            to="/auth/onboarding/hashtag"
            className="mt-1 inline-flex h-9 w-24 shrink-0 items-center justify-center rounded-lg bg-neutral-200 font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
          >
            Add
          </Link>
        )}
      </div>
    </div>
  );
}
