import { NDKEvent } from '@nostr-dev-kit/ndk';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';

import { Boost, Hashtag, Invoice, MentionUser } from '@shared/notes';

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
    <ReactMarkdown
      className="break-p prose prose-neutral max-w-none select-text whitespace-pre-line leading-normal dark:prose-invert prose-headings:mb-1 prose-headings:mt-3 prose-p:mb-0 prose-p:mt-0 prose-p:last:mb-1 prose-a:font-normal prose-a:text-blue-500 prose-blockquote:mb-1 prose-blockquote:mt-1 prose-blockquote:border-l-[2px] prose-blockquote:border-blue-500 prose-blockquote:pl-2 prose-pre:whitespace-pre-wrap prose-pre:bg-white/10 prose-ol:m-0 prose-ol:mb-1 prose-ul:mb-1 prose-ul:mt-1 prose-img:mb-2 prose-img:mt-3 prose-hr:mx-0 prose-hr:my-2 hover:prose-a:text-blue-500"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeExternalLinks({ target: '_blank' })]}
      components={{
        a: ({ href }) => {
          const cleanURL = new URL(href);
          cleanURL.search = '';
          return (
            <Link to={href} target="_blank" className="w-max break-all hover:!underline">
              {cleanURL.hostname + cleanURL.pathname}
            </Link>
          );
        },
        del: ({ children }) => {
          const key = children[0] as string;
          if (typeof key !== 'string') return;
          if (key.startsWith('pub') && key.length > 50 && key.length < 100) {
            return <MentionUser pubkey={key.replace('pub-', '')} />;
          }
          if (key.startsWith('tag')) {
            return <Hashtag tag={key.replace('tag-', '')} />;
          }
          if (key.startsWith('boost')) {
            return <Boost boost={key.replace('boost-', '')} />;
          }
          if (key.startsWith('lnbc')) {
            return <Invoice invoice={key.replace('lnbc-', '')} />;
          }
        },
      }}
    >
      {event.content}
    </ReactMarkdown>
  );
}
