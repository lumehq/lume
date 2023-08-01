import { Image } from '@shared/image';

import { useOpenGraph } from '@utils/hooks/useOpenGraph';

export function LinkPreview({ urls }: { urls: string[] }) {
  const { status, data, error } = useOpenGraph(urls[0]);
  const domain = new URL(urls[0]);

  return (
    <div className="mb-2 mt-3 max-w-[420px] overflow-hidden rounded-lg bg-white/10">
      {status === 'loading' ? (
        <div className="flex flex-col">
          <div className="h-44 w-full animate-pulse bg-zinc-700" />
          <div className="flex flex-col gap-2 px-3 py-3">
            <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-700" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-700" />
            <span className="mt-2.5 text-sm leading-none text-zinc-500">
              {domain.hostname}
            </span>
          </div>
        </div>
      ) : (
        <a
          className="flex flex-col rounded-lg"
          href={urls[0]}
          target="_blank"
          rel="noreferrer"
        >
          {error ? (
            <div className="px-3 py-3">
              <p className="line-clamp-3 break-all text-sm text-zinc-400">
                Can&apos;t fetch open graph, click to open webpage
              </p>
            </div>
          ) : (
            <>
              {data.images?.[0] && (
                <Image
                  src={data.images?.[0] || 'https://void.cat/d/XTmrMkpid8DGLjv1AzdvcW'}
                  fallback="https://void.cat/d/XTmrMkpid8DGLjv1AzdvcW"
                  alt={urls[0]}
                  className="h-44 w-full rounded-t-lg object-cover"
                />
              )}
              <div className="flex flex-col gap-2 px-3 py-3">
                <h5 className="line-clamp-1 font-medium leading-none text-white">
                  {data.title}
                </h5>
                {data.description && (
                  <p className="line-clamp-3 break-all text-sm text-white/50">
                    {data.description}
                  </p>
                )}
                <span className="mt-2.5 text-sm leading-none text-white/50">
                  {domain.hostname}
                </span>
              </div>
            </>
          )}
        </a>
      )}
    </div>
  );
}
