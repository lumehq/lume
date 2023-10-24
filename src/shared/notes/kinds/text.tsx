import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

import {
  Boost,
  Hashtag,
  ImagePreview,
  Invoice,
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
          className="break-p prose prose-neutral max-w-none select-text whitespace-pre-line leading-normal dark:prose-invert prose-headings:mb-1 prose-headings:mt-3 prose-p:mb-0 prose-p:mt-0 prose-p:last:mb-1 prose-a:font-normal prose-a:text-blue-500 prose-blockquote:mb-1 prose-blockquote:mt-1 prose-blockquote:border-l-[2px] prose-blockquote:border-blue-500 prose-blockquote:pl-2 prose-pre:whitespace-pre-wrap prose-pre:bg-white/10 prose-ol:m-0 prose-ol:mb-1 prose-ul:mb-1 prose-ul:mt-1 prose-img:mb-2 prose-img:mt-3 prose-hr:mx-0 prose-hr:my-2 hover:prose-a:text-blue-500"
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
        className="break-p prose prose-neutral max-w-none select-text whitespace-pre-line leading-normal dark:prose-invert prose-headings:mb-1 prose-headings:mt-3 prose-p:mb-0 prose-p:mt-0 prose-p:last:mb-1 prose-a:font-normal prose-a:text-blue-500 prose-blockquote:mb-1 prose-blockquote:mt-1 prose-blockquote:border-l-[2px] prose-blockquote:border-blue-500 prose-blockquote:pl-2 prose-pre:whitespace-pre-wrap prose-pre:bg-white/10 prose-ol:m-0 prose-ol:mb-1 prose-ul:mb-1 prose-ul:mt-1 prose-img:mb-2 prose-img:mt-3 prose-hr:mx-0 prose-hr:my-2 hover:prose-a:text-blue-500"
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href }) => {
            const cleanURL = new URL(href);
            cleanURL.search = '';
            return (
              <Link to={href} target="_blank" className="w-max break-all hover:underline">
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
        disallowedElements={['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code']}
        unwrapDisallowed={true}
        linkTarget={'_blank'}
      >
        {richContent.parsed}
      </ReactMarkdown>
      {richContent.images.length > 0 && <ImagePreview urls={richContent.images} />}
      {richContent.videos.length > 0 && <VideoPreview urls={richContent.videos} />}
      {richContent.links.length > 0 && <LinkPreview urls={richContent.links} />}
      {richContent.notes.length > 0 &&
        richContent.notes.map((note: string) => <MentionNote key={note} id={note} />)}
    </div>
  );
}

export const MemoizedTextNote = memo(TextNote);
