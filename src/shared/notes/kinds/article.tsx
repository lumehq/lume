import { NDKTag } from '@nostr-dev-kit/ndk';
import { memo } from 'react';
import { Link } from 'react-router-dom';

export function ArticleKind({ id, tags }: { id: string; tags: NDKTag[] }) {
  const getMetadata = () => {
    const title = tags.find((tag) => tag[0] === 'title')?.[1];
    const image = tags.find((tag) => tag[0] === 'image')?.[1];
    const summary = tags.find((tag) => tag[0] === 'summary')?.[1];

    let publishedAt: Date | string | number = tags.find(
      (tag) => tag[0] === 'published_at'
    )?.[1];

    publishedAt = new Date(parseInt(publishedAt) * 1000).toLocaleDateString('en-US');

    return {
      title,
      image,
      publishedAt,
      summary,
    };
  };

  const metadata = getMetadata();

  return (
    <Link
      to={`/notes/article/${id}`}
      preventScrollReset={true}
      className="flex w-full flex-col rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
    >
      {metadata.image && (
        <img
          src={metadata.image}
          alt={metadata.title}
          className="h-56 w-full rounded-t-lg object-cover"
        />
      )}
      <div className="flex flex-col gap-1 rounded-b-lg bg-neutral-200 px-3 py-3 dark:bg-neutral-800">
        <h5 className="break-all font-semibold text-neutral-900 dark:text-neutral-100">
          {metadata.title}
        </h5>
        {metadata.summary ? (
          <p className="line-clamp-3 break-all text-sm text-neutral-600 dark:text-neutral-400">
            {metadata.summary}
          </p>
        ) : null}
        <span className="mt-2.5 text-sm text-neutral-600 dark:text-neutral-400">
          {metadata.publishedAt.toString()}
        </span>
      </div>
    </Link>
  );
}

export const MemoizedArticleKind = memo(ArticleKind);
