import { Link } from 'react-router-dom';

import { useOpenGraph } from '@utils/hooks/useOpenGraph';

function isImage(url: string) {
  return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif)$/.test(url);
}

export function LinkPreview({ urls }: { urls: string[] }) {
  const { status, data } = useOpenGraph(urls[0]);
  const domain = new URL(urls[0]);

  if (status === 'pending') {
    return (
      <div className="flex w-full flex-col bg-neutral-200 dark:bg-neutral-800">
        <div className="h-44 w-full animate-pulse bg-neutral-400 dark:bg-neutral-600" />
        <div className="flex flex-col gap-2 px-3 py-3">
          <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-400 dark:bg-neutral-600" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-400 dark:bg-neutral-600" />
          <span className="mt-2.5 text-sm leading-none text-neutral-600 dark:text-neutral-400">
            {domain.hostname}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={urls[0]}
      target="_blank"
      rel="noreferrer"
      className="flex w-full flex-col rounded-lg border border-neutral-300 bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800"
    >
      {isImage(data.image) ? (
        <img
          src={data.image}
          alt={urls[0]}
          className="h-44 w-full rounded-t-lg bg-white object-cover"
        />
      ) : null}
      <div className="flex flex-col items-start px-3 py-3">
        <div className="flex flex-col items-start gap-1 text-left">
          {data.title && (
            <h5 className="line-clamp-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {data.title}
            </h5>
          )}
          {data.description ? (
            <p className="mb-2.5 line-clamp-3 break-all text-sm text-neutral-700 dark:text-neutral-400">
              {data.description}
            </p>
          ) : null}
        </div>
        <span className="break-all text-sm text-neutral-600 dark:text-neutral-400">
          {domain.hostname}
        </span>
      </div>
    </Link>
  );
}
