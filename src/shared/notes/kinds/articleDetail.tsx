import { NDKEvent } from '@nostr-dev-kit/ndk';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ArticleDetailNote({ event }: { event: NDKEvent }) {
  /*const metadata = useMemo(() => {
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
  }, [event.id]);*/

  return (
    <ReactMarkdown className="markdown-article" remarkPlugins={[remarkGfm]}>
      {event.content}
    </ReactMarkdown>
  );
}
