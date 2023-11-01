import Markdown from 'markdown-to-jsx';
import { memo } from 'react';

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

export function TextNote(props: { content?: string; truncate?: boolean }) {
  const richContent = parser(props.content);

  if (props.truncate) {
    return (
      <div className="break-p prose prose-neutral line-clamp-4 max-w-none select-text whitespace-pre-line leading-normal dark:prose-invert prose-headings:mb-1 prose-headings:mt-3 prose-p:mb-0 prose-p:mt-0 prose-p:last:mb-1 prose-a:font-normal prose-a:text-blue-500 prose-blockquote:mb-1 prose-blockquote:mt-1 prose-blockquote:border-l-[2px] prose-blockquote:border-blue-500 prose-blockquote:pl-2 prose-pre:whitespace-pre-wrap prose-pre:bg-white/10 prose-ol:m-0 prose-ol:mb-1 prose-ul:mb-1 prose-ul:mt-1 prose-img:mb-2 prose-img:mt-3 prose-hr:mx-0 prose-hr:my-2 hover:prose-a:text-blue-600 prose-a:hover:underline">
        {props.content}
      </div>
    );
  }

  return (
    <div>
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
          },
          slugify: (str) => str,
          forceBlock: true,
          enforceAtxHeadings: true,
        }}
        className="break-p prose prose-neutral max-w-none select-text whitespace-pre-line leading-normal dark:prose-invert prose-headings:mb-1 prose-headings:mt-3 prose-p:mb-0 prose-p:mt-0 prose-p:last:mb-1 prose-a:font-normal prose-a:text-blue-500 prose-blockquote:mb-1 prose-blockquote:mt-1 prose-blockquote:border-l-[2px] prose-blockquote:border-blue-500 prose-blockquote:pl-2 prose-pre:whitespace-pre-wrap prose-pre:bg-white/10 prose-ol:m-0 prose-ol:mb-1 prose-ul:mb-1 prose-ul:mt-1 prose-img:mb-2 prose-img:mt-3 prose-hr:mx-0 prose-hr:my-2 hover:prose-a:text-blue-600 prose-a:hover:underline"
      >
        {richContent.parsed}
      </Markdown>
      {richContent.images.length ? <ImagePreview urls={richContent.images} /> : null}
      {richContent.videos.length ? <VideoPreview urls={richContent.videos} /> : null}
      {richContent.links.length ? <LinkPreview urls={richContent.links} /> : null}
      {richContent.notes.map((note: string) => (
        <MentionNote key={note} id={note} />
      ))}
    </div>
  );
}

export const MemoizedTextNote = memo(TextNote);
