import { memo } from 'react';

import { ImagePreview, LinkPreview, VideoPreview } from '@shared/notes';

import { useRichContent } from '@utils/hooks/useRichContent';

export function TextNote(props: { content?: string; truncate?: boolean }) {
  const { parsedContent, images, videos, linkPreview } = useRichContent(props.content);

  if (props.truncate) {
    return (
      <div className="break-p prose prose-neutral max-w-none select-text whitespace-pre-line leading-normal dark:prose-invert">
        {props.content}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="break-p prose prose-neutral max-w-none select-text whitespace-pre-line leading-normal dark:prose-invert prose-img:mb-0 prose-img:mt-0">
        {parsedContent}
      </div>
      {images.length ? <ImagePreview urls={images} /> : null}
      {videos.length ? <VideoPreview urls={videos} /> : null}
      {linkPreview ? <LinkPreview url={linkPreview} /> : null}
    </div>
  );
}

export const MemoizedTextNote = memo(TextNote);
