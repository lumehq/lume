import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Hashtag, MentionUser } from '@shared/notes';

import { RichContent } from '@utils/types';

export function NotiContent({ content }: { content: RichContent }) {
  return (
    <>
      <ReactMarkdown
        className="markdown"
        remarkPlugins={[remarkGfm]}
        components={{
          del: ({ children }) => {
            const key = children[0] as string;
            if (key.startsWith('pub') && key.length > 50 && key.length < 100)
              return <MentionUser pubkey={key.replace('pub-', '')} />;
            if (key.startsWith('tag')) return <Hashtag tag={key.replace('tag-', '')} />;
          },
        }}
      >
        {content?.parsed}
      </ReactMarkdown>
    </>
  );
}
