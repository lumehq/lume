/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageCard from '@components/note/content/preview/imageCard';
import Video from '@components/note/content/preview/video';

import { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

const MarkdownPreview = dynamic<MarkdownPreviewProps>(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

export default function Content({ data }: { data: string }) {
  const [preview, setPreview] = useState({});

  const content = useRef(data);
  const urls = useMemo(
    () =>
      data.match(
        /((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
      ),
    [data]
  );

  useEffect(() => {
    if (urls !== null && urls.length > 0) {
      const parseURL = new URL(urls[0]);

      if (parseURL.pathname.toLowerCase().match(/\.(jpg|jpeg|gif|png|webp)$/)) {
        // add image to preview
        setPreview({ image: parseURL.href, type: 'image' });
        content.current = content.current.replace(parseURL.href, '');
      } else if (ReactPlayer.canPlay(parseURL.href)) {
        // add video to preview
        setPreview({ url: parseURL.href, type: 'video' });
        content.current = content.current.replace(parseURL.href, '');
      } // #TODO: support multiple preview
    }
  }, [urls]);

  const previewAttachment = useCallback(() => {
    if (Object.keys(preview).length > 0) {
      switch (preview['type']) {
        case 'image':
          return <ImageCard data={preview} />;
        case 'video':
          return <Video data={preview} />;
        default:
          return null;
      }
    }
  }, [preview]);

  return (
    <div className="flex flex-col">
      <div>
        <MarkdownPreview
          source={content.current}
          className={
            'prose prose-zinc max-w-none break-words dark:prose-invert prose-headings:mt-3 prose-headings:mb-2 prose-p:m-0 prose-p:leading-normal prose-ul:mt-2 prose-li:my-1'
          }
          linkTarget="_blank"
          disallowedElements={[
            'Table',
            'Heading ID',
            'Highlight',
            'Fenced Code Block',
            'Footnote',
            'Definition List',
            'Task List',
          ]}
        />
      </div>
      <div>{previewAttachment()}</div>
    </div>
  );
}
