import { NoteQuote } from '@lume/app/newsfeed/components/note/quote';
import { NoteMentionUser } from '@lume/app/newsfeed/components/user/mention';
import ImagePreview from '@lume/shared/preview/image';
import VideoPreview from '@lume/shared/preview/video';
import YoutubePreview from '@lume/shared/preview/youtube';

import destr from 'destr';
import reactStringReplace from 'react-string-replace';

export const contentParser = (noteContent: any, noteTags: any) => {
  let parsedContent = noteContent.trim();

  // get data tags
  const tags = destr(noteTags);
  // handle urls
  parsedContent = reactStringReplace(parsedContent, /(https?:\/\/\S+)/g, (match, i) => {
    if (match.match(/\.(jpg|jpeg|gif|png|webp)$/i)) {
      // image url
      return <ImagePreview key={match + i} url={match} size="large" />;
    } else if (match.match(/(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?/)) {
      // youtube
      return <YoutubePreview key={match + i} url={match} size="large" />;
    } else if (match.match(/\.(mp4|webm)$/i)) {
      // video
      return <VideoPreview key={match + i} url={match} size="large" />;
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
  // handle mentions
  if (tags && tags.length > 0) {
    parsedContent = reactStringReplace(parsedContent, /\#\[(\d+)\]/gm, (match, i) => {
      if (tags[match][0] === 'p') {
        // @-mentions
        return <NoteMentionUser key={tags[match][1] + i} pubkey={tags[match][1]} />;
      } else if (tags[match][0] === 'e') {
        // note-quotes
        return <NoteQuote key={tags[match][1] + i} id={tags[match][1]} />;
      } else {
        return;
      }
    });
  }

  return parsedContent;
};
