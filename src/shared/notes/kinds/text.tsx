import { memo } from 'react';

import { ImagePreview, LinkPreview, MentionNote, VideoPreview } from '@shared/notes';

import { parser } from '@utils/parser';

export function TextNote(props: { content?: string }) {
  const richContent = parser(props.content);

  return (
    <div>
      <div className="break-p prose prose-neutral max-w-none select-text whitespace-pre-line leading-normal dark:prose-invert prose-headings:mb-1 prose-headings:mt-3 prose-p:mb-0 prose-p:mt-0 prose-p:last:mb-1 prose-a:font-normal prose-a:text-blue-500 prose-blockquote:mb-1 prose-blockquote:mt-1 prose-blockquote:border-l-[2px] prose-blockquote:border-blue-500 prose-blockquote:pl-2 prose-pre:whitespace-pre-wrap prose-pre:bg-white/10 prose-ol:m-0 prose-ol:mb-1 prose-ul:mb-1 prose-ul:mt-1 prose-img:mb-2 prose-img:mt-3 prose-hr:mx-0 prose-hr:my-2 hover:prose-a:text-blue-500">
        {richContent.parsed}
      </div>
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
