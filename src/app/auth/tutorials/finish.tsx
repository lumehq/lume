import { NDKKind } from '@nostr-dev-kit/ndk';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useArk } from '@libs/ark';

import { LoaderIcon } from '@shared/icons';

import { FETCH_LIMIT } from '@utils/constants';

export function TutorialFinishScreen() {
  const { ark } = useArk();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const prefetch = async () => {
    if (!ark.account.contacts.length) return navigate('/');

    try {
      setLoading(true);

      // prefetch newsfeed
      await queryClient.prefetchInfiniteQuery({
        queryKey: ['newsfeed'],
        initialPageParam: 0,
        queryFn: async ({
          signal,
          pageParam,
        }: {
          signal: AbortSignal;
          pageParam: number;
        }) => {
          return await ark.getInfiniteEvents({
            filter: {
              kinds: [NDKKind.Text, NDKKind.Repost],
              authors: !ark.account.contacts.length
                ? [ark.account.pubkey]
                : ark.account.contacts,
            },
            limit: FETCH_LIMIT,
            pageParam,
            signal,
          });
        },
      });

      // prefetch notification
      await queryClient.prefetchInfiniteQuery({
        queryKey: ['notification'],
        initialPageParam: 0,
        queryFn: async ({
          signal,
          pageParam,
        }: {
          signal: AbortSignal;
          pageParam: number;
        }) => {
          return await ark.getInfiniteEvents({
            filter: {
              kinds: [NDKKind.Text, NDKKind.Repost, NDKKind.Reaction, NDKKind.Zap],
              '#p': [ark.account.pubkey],
            },
            limit: FETCH_LIMIT,
            pageParam,
            signal,
          });
        },
      });

      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

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
          <button
            type="button"
            onClick={prefetch}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600"
          >
            {loading ? (
              <LoaderIcon className="h-4 w-4 animate-spin" />
            ) : (
              'Start using Lume'
            )}
          </button>
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
