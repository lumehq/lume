import ImagePreview from '@lume/shared/preview/image';
import VideoPreview from '@lume/shared/preview/video';
import YoutubePreview from '@lume/shared/preview/youtube';

import reactStringReplace from 'react-string-replace';

export const messageParser = (noteContent: any) => {
  let parsedContent = noteContent.trim();

  // handle urls
  parsedContent = reactStringReplace(parsedContent, /(https?:\/\/\S+)/g, (match, i) => {
    if (match.match(/\.(jpg|jpeg|gif|png|webp)$/i)) {
      // image url
      return <ImagePreview key={match + i} url={match} size="small" />;
    } else if (match.match(/(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?/)) {
      // youtube
      return <YoutubePreview key={match + i} url={match} size="small" />;
    } else if (match.match(/\.(mp4|webm)$/i)) {
      // video
      return <VideoPreview key={match + i} url={match} size="small" />;
    } else {
      return (
        <a key={match + i} href={match} className="cursor-pointer text-fuchsia-500" target="_blank" rel="noreferrer">
          {match}
        </a>
      );
    }
  });
  // handle #-hashtags
  parsedContent = reactStringReplace(parsedContent, /#(\w+)/g, (match, i) => (
    <span key={match + i} className="cursor-pointer text-fuchsia-500">
      #{match}
    </span>
  ));

  return parsedContent;
};
