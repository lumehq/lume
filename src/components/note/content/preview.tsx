import { ImagePreview } from '@components/note/preview/image';
import { VideoPreview } from '@components/note/preview/video';

import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

export default function NotePreview({ content }: { content: string }) {
  const [video, setVideo] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const urls = content.match(
      /((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
    );

    if (urls !== null && urls.length > 0) {
      urls.forEach((url) => {
        // make sure url alway have http://
        if (!/^https?:\/\//i.test(url)) {
          url = 'http://' + url;
        }
        // parse url with new URL();
        const parseURL = new URL(url, 'https://uselume.xyz');
        // parse image url
        if (parseURL.pathname.toLowerCase().match(/\.(jpg|jpeg|gif|png|webp)$/)) {
          // add image to preview
          setImages((images) => [...images, parseURL.href]);
        } else if (ReactPlayer.canPlay(parseURL.href)) {
          // add video to preview
          setVideo(parseURL.href);
        }
      });
    }
  }, [content]);

  if (video) {
    return <VideoPreview data={video} />;
  } else if (images.length > 0) {
    return <ImagePreview data={images} />;
  } else {
    return <></>;
  }
}
