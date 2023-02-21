/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef } from 'react';

const MarkdownPreview = dynamic<MarkdownPreviewProps>(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

export default function Content({ data }: { data: string }) {
  const imagesRef = useRef([]);
  const videosRef = useRef([]);

  const urls = useMemo(
    () =>
      data.match(
        /((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
      ),
    [data]
  );

  const extractURL = useCallback((urls: any[]) => {
    if (urls !== null && urls.length > 0) {
      urls.forEach((url: string | URL) => {
        const parseURL = new URL(url);
        const path = parseURL.pathname.toLowerCase();
        switch (path) {
          case path.match(/\.(jpg|jpeg|gif|png|webp)$/)?.input:
            imagesRef.current.push(parseURL.href);
            break;
          case path.match(
            /(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/
          )?.input:
            videosRef.current.push(parseURL.href);
            break;
          case path.match(/\.(mp4|webm|m4v|mov|avi|mkv|flv)$/)?.input:
            videosRef.current.push(parseURL.href);
            break;
          default:
            break;
        }
      });
    }
  }, []);

  useEffect(() => {
    extractURL(urls);
  }, [extractURL, urls]);

  return (
    <div className="flex flex-col">
      <MarkdownPreview
        source={data}
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
  );
}
