import { NDKEvent } from '@nostr-dev-kit/ndk';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Image } from '@shared/image';

export function ArticleNote(props: { event?: NDKEvent }) {
  const metadata = useMemo(() => {
    const title = props.event.tags.find((tag) => tag[0] === 'title')?.[1];
    const image = props.event.tags.find((tag) => tag[0] === 'image')?.[1];
    const summary = props.event.tags.find((tag) => tag[0] === 'summary')?.[1];

    let publishedAt: Date | string | number = props.event.tags.find(
      (tag) => tag[0] === 'published_at'
    )?.[1];
    if (publishedAt) {
      publishedAt = new Date(parseInt(publishedAt) * 1000).toLocaleDateString('en-US');
    } else {
      publishedAt = new Date(props.event.created_at * 1000).toLocaleDateString('en-US');
    }

    return {
      title,
      image,
      publishedAt,
      summary,
    };
  }, [props.event.id]);

  return (
    <Link to={`/notes/article/${props.event.id}`} preventScrollReset={true}>
      <div className="my-2 overflow-hidden rounded-lg">
        {metadata.image && (
          <Image
            src={metadata.image}
            alt={metadata.title}
            className="h-44 w-full rounded-t-lg object-cover"
          />
        )}
        <div className="flex flex-col gap-1 rounded-b-lg bg-neutral-200 px-3 py-3 dark:bg-neutral-800">
          <h5 className="line-clamp-1 font-semibold text-neutral-900 dark:text-neutral-100">
            {metadata.title}
          </h5>
          {metadata.summary ? (
            <p className="line-clamp-3 break-all text-sm text-neutral-600 dark:text-neutral-400">
              {metadata.summary}
            </p>
          ) : null}
          <span className="mt-2.5 text-sm text-neutral-500 dark:text-neutral-400">
            {metadata.publishedAt.toString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

export const MemoizedArticleNote = memo(ArticleNote);
