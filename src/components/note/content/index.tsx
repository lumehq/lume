import { ImageCard } from '@components/note/content/preview/imageCard';
import { Video } from '@components/note/content/preview/video';
import { Reaction } from '@components/note/reaction';
import { Reply } from '@components/note/reply';
import { UserExtend } from '@components/user/extend';

import dynamic from 'next/dynamic';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
  loading: () => <div className="h-4 w-36 animate-pulse rounded bg-zinc-700" />,
});

export const Content = memo(function Content({ data }: { data: any }) {
  const [preview, setPreview] = useState({});

  const content = useRef(data.content);
  const urls = useMemo(
    () =>
      content.current.match(
        /((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
      ),
    []
  );

  useEffect(() => {
    if (urls !== null && urls.length > 0) {
      // #TODO: support multiple url
      let url = urls[0];
      // make sure url alway have http://
      if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
      }
      // parse url with new URL();
      const parseURL = new URL(url, 'https://uselume.xyz');
      // #TODO performance test
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
    <div className="relative z-10 flex flex-col">
      <UserExtend pubkey={data.pubkey} time={data.created_at} />
      <div className="-mt-4 pl-[60px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <div>
              <MarkdownPreview
                source={content.current}
                className={
                  'prose prose-zinc max-w-none break-words dark:prose-invert prose-headings:mt-3 prose-headings:mb-2 prose-p:m-0 prose-p:leading-normal prose-a:font-medium prose-a:text-fuchsia-500 prose-a:no-underline prose-ul:mt-2 prose-li:my-1'
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
            <>{previewAttachment()}</>
          </div>
          <div className="relative z-10 -ml-1 flex items-center gap-8">
            <Reply eventID={data.id} />
            <Reaction eventID={data.id} eventPubkey={data.pubkey} />
          </div>
        </div>
      </div>
    </div>
  );
});
