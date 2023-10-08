import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

import {
  Boost,
  Hashtag,
  ImagePreview,
  LinkPreview,
  MentionNote,
  MentionUser,
  VideoPreview,
} from '@shared/notes';

import { parser } from '@utils/parser';

export function TextNote(props: { content?: string }) {
  const richContent = parser(props.content) ?? null;

  if (!richContent) {
    return (
      <div>
        <ReactMarkdown
          className="prose prose-zinc max-w-none select-text dark:prose-invert prose-headings:mb-1 prose-headings:mt-3 prose-p:mb-0 prose-p:mt-0 prose-p:last:mb-0 prose-a:font-normal prose-a:text-interor-500 hover:prose-a:text-interor-600 prose-blockquote:mb-1 prose-blockquote:mt-1 prose-blockquote:border-l-[2px] prose-blockquote:border-interor-500 prose-blockquote:pl-2 prose-pre:whitespace-pre-wrap prose-pre:break-words prose-pre:break-all prose-pre:bg-white/10 prose-ol:m-0 prose-ol:mb-1 prose-ul:mb-1 prose-ul:mt-1 prose-img:mb-2 prose-img:mt-3 prose-hr:mx-0 prose-hr:my-2"
          remarkPlugins={[remarkGfm]}
          disallowedElements={['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code']}
          unwrapDisallowed={true}
          linkTarget={'_blank'}
        >
          {props.content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div>
      <ReactMarkdown
        className="prose prose-zinc max-w-none select-text dark:prose-invert prose-headings:mb-1 prose-headings:mt-3 prose-p:mb-0 prose-p:mt-0 prose-p:last:mb-0 prose-a:font-normal prose-a:text-interor-500 hover:prose-a:text-interor-600 prose-blockquote:mb-1 prose-blockquote:mt-1 prose-blockquote:border-l-[2px] prose-blockquote:border-interor-500 prose-blockquote:pl-2 prose-pre:whitespace-pre-wrap prose-pre:break-words prose-pre:break-all prose-pre:bg-white/10 prose-ol:m-0 prose-ol:mb-1 prose-ul:mb-1 prose-ul:mt-1 prose-img:mb-2 prose-img:mt-3 prose-hr:mx-0 prose-hr:my-2"
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href }) => {
            const cleanURL = new URL(href);
            cleanURL.search = '';
            return (
              <Link to={href} target="_blank" className="line-clamp-1 w-full break-all">
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
          },
        }}
        disallowedElements={['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code']}
        unwrapDisallowed={true}
        linkTarget={'_blank'}
      >
        {richContent.parsed}
      </ReactMarkdown>
      <div>
        {richContent.images.length > 0 && <ImagePreview urls={richContent.images} />}
        {richContent.videos.length > 0 && <VideoPreview urls={richContent.videos} />}
        {richContent.links.length > 0 && <LinkPreview urls={richContent.links} />}
        {richContent.notes.length > 0 &&
          richContent.notes.map((note: string) => <MentionNote key={note} id={note} />)}
      </div>
    </div>
  );
}
