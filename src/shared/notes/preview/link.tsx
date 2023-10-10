import { Link } from 'react-router-dom';

import { useOpenGraph } from '@utils/hooks/useOpenGraph';

export function LinkPreview({ urls }: { urls: string[] }) {
  const { status, data, error } = useOpenGraph(urls[0]);
  const domain = new URL(urls[0]);

  return (
    <div className="my-2">
      {status === 'loading' ? (
        <div className="flex flex-col bg-neutral-200 dark:bg-neutral-800">
          <div className="h-44 w-full animate-pulse bg-white/10 backdrop-blur-xl" />
          <div className="flex flex-col gap-2 px-3 py-3">
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-white/10 backdrop-blur-xl" />
            <span className="mt-2.5 text-sm leading-none text-white/50">
              {domain.hostname}
            </span>
          </div>
        </div>
      ) : (
        <Link
          to={urls[0]}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col rounded-lg bg-neutral-200 dark:bg-neutral-800"
        >
          {error ? (
            <div className="flex flex-col gap-2 px-3 py-3">
              <p className="text-sm text-white/50">
                Can&apos;t fetch open graph, click to open webpage
              </p>
              <span className="text-sm leading-none text-neutral-900 dark:text-neutral-100">
                {domain.hostname}
              </span>
            </div>
          ) : (
            <>
              {data.image && (
                <img
                  src={data.image}
                  alt={urls[0]}
                  className="h-44 w-full rounded-t-lg object-cover"
                />
              )}
              <div className="flex flex-col gap-1 border-t border-white/5 px-3 py-3">
                <h5 className="line-clamp-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  {data.title}
                </h5>
                {data.description && (
                  <p className="line-clamp-3 break-all text-sm text-neutral-500 dark:text-neutral-400">
                    {data.description}
                  </p>
                )}
                <span className="mt-2.5 text-sm text-neutral-500 dark:text-neutral-400">
                  {domain.hostname}
                </span>
              </div>
            </>
          )}
        </Link>
      )}
    </div>
  );
}
