import { NDKKind } from '@nostr-dev-kit/ndk';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useArk } from '@libs/ark';

import { LoaderIcon } from '@shared/icons';

import { FETCH_LIMIT } from '@utils/constants';

export function FinishScreen() {
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
          <button
            type="button"
            onClick={prefetch}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-neutral-100 font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            {loading ? <LoaderIcon className="h-4 w-4 animate-spin" /> : 'Skip'}
          </button>
          <p className="text-center text-sm font-medium text-neutral-500 dark:text-neutral-600">
            You need to restart app to make changes in previous step take effect or you
            can continue with Lume default settings
          </p>
        </div>
      </div>
    </div>
  );
}
