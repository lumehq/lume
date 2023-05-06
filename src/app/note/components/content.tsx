import ImagePreview from '@lume/app/note/components/preview/image';
import VideoPreview from '@lume/app/note/components/preview/video';
import { NoteQuote } from '@lume/app/note/components/quote';
import { NoteMentionUser } from '@lume/app/note/components/user/mention';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const NoteContent = ({ content }: { content: any }) => {
  return (
    <>
      <ReactMarkdown
        remarkPlugins={[[remarkGfm]]}
        linkTarget="_blank"
        className="prose prose-zinc max-w-none break-words dark:prose-invert prose-p:text-[15px] prose-p:leading-tight prose-a:text-[15px] prose-a:leading-tight prose-a:text-fuchsia-500 prose-a:no-underline prose-a:hover:text-fuchsia-600 prose-a:hover:underline prose-ol:mb-1 prose-ul:mb-1 prose-li:text-[15px] prose-li:leading-tight"
        components={{
          h5: ({ ...props }) => <NoteMentionUser pubkey={props.content} />,
          h6: ({ ...props }) => <NoteQuote id={props.content} />,
          em: ({ ...props }) => <span className="text-fuchsia-500 hover:text-fuchsia-600" {...props} />,
        }}
      >
        {content.parsed}
      </ReactMarkdown>
      {Array.isArray(content.images) && content.images.length ? <ImagePreview urls={content.images} /> : <></>}
      {Array.isArray(content.videos) && content.videos.length ? <VideoPreview urls={content.videos} /> : <></>}
    </>
  );
};
