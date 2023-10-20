import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AllowNotification } from '@app/auth/components/features/allowNotification';
import { Circle } from '@app/auth/components/features/enableCircle';
import { OutboxModel } from '@app/auth/components/features/enableOutbox';
import { FavoriteHashtag } from '@app/auth/components/features/favoriteHashtag';
import { FollowList } from '@app/auth/components/features/followList';
import { SuggestFollow } from '@app/auth/components/features/suggestFollow';

import { LoaderIcon } from '@shared/icons';

export function OnboardingListScreen() {
  const { state } = useLocation();
  const { newuser }: { newuser: boolean } = state;

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const completed = () => {
    setLoading(true);

    const timeout = setTimeout(() => setLoading(false), 200);
    clearTimeout(timeout);

    navigate('/');
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-10">
        <div className="text-center">
          <h1 className="text-2xl text-neutral-900 dark:text-neutral-100">
            You&apos;re almost ready to use Lume.
          </h1>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Let&apos;s start personalizing your experience.
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {newuser ? <SuggestFollow /> : <FollowList />}
          <FavoriteHashtag />
          <Circle />
          <OutboxModel />
          <AllowNotification />
          <button
            type="button"
            onClick={completed}
            className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600"
          >
            {loading ? <LoaderIcon className="h-4 w-4 animate-spin" /> : ' Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
