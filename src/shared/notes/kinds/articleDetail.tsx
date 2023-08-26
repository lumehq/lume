import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

import { Image } from '@shared/image';

export function ArticleDetailNote({ event }: { event: NDKEvent }) {
  const metadata = useMemo(() => {
    const title = event.tags.find((tag) => tag[0] === 'title')?.[1];
    const image = event.tags.find((tag) => tag[0] === 'image')?.[1];
    const summary = event.tags.find((tag) => tag[0] === 'summary')?.[1];

    let publishedAt: Date | string | number = event.tags.find(
      (tag) => tag[0] === 'published_at'
    )?.[1];
    if (publishedAt) {
      publishedAt = new Date(parseInt(publishedAt)).toLocaleDateString('en-US');
    } else {
      publishedAt = new Date(event.created_at * 1000).toLocaleDateString('en-US');
    }

    return {
      title,
      image,
      publishedAt,
      summary,
    };
  }, [event.id]);

  return (
    <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
      {event.content}
    </ReactMarkdown>
  );
}
