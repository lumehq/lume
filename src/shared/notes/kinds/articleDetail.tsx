import { NDKEvent } from '@nostr-dev-kit/ndk';
import Markdown from 'markdown-to-jsx';

import { Boost, Hashtag, Invoice, MentionUser } from '@shared/notes';

export function ArticleDetailNote({ event }: { event: NDKEvent }) {
  return (
    <Markdown
      options={{
        overrides: {
          Hashtag: {
            component: Hashtag,
          },
          Boost: {
            component: Boost,
          },
          MentionUser: {
            component: MentionUser,
          },
          Invoice: {
            component: Invoice,
          },
          a: {
            props: {
              target: '_blank',
            },
          },
        },
        slugify: (str) => str,
        forceBlock: true,
        enforceAtxHeadings: true,
      }}
      className="break-p prose prose-neutral max-w-none select-text whitespace-pre-line leading-normal dark:prose-invert prose-headings:mb-1 prose-headings:mt-3 prose-p:mb-0 prose-p:mt-0 prose-p:last:mb-1 prose-a:font-normal prose-a:text-blue-500 prose-blockquote:mb-1 prose-blockquote:mt-1 prose-blockquote:border-l-[2px] prose-blockquote:border-blue-500 prose-blockquote:pl-2 prose-pre:whitespace-pre-wrap prose-pre:bg-white/10 prose-ol:m-0 prose-ol:mb-1 prose-ul:mb-1 prose-ul:mt-1 prose-img:mb-2 prose-img:mt-3 prose-hr:mx-0 prose-hr:my-2 hover:prose-a:text-blue-500"
    >
      {event.content}
    </Markdown>
  );
}
