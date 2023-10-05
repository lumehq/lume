import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';
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
      <div className="mb-2 mt-2 flex flex-col rounded-lg">
        {metadata.image && (
          <Image
            src={metadata.image}
            alt={metadata.title}
            className="h-44 w-full rounded-t-lg object-cover"
          />
        )}
        <div className="flex flex-col gap-2 rounded-b-lg bg-white/10 px-3 py-3 backdrop-blur-xl">
          <h5 className="line-clamp-1 text-base font-medium text-white">
            {metadata.title}
          </h5>
          {metadata.summary ? (
            <p className="line-clamp-3 break-all text-sm text-white/70">
              {metadata.summary}
            </p>
          ) : null}
          <span className="mt-2.5 text-sm text-white/70">
            {metadata.publishedAt.toString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
