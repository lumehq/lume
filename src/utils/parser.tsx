import { ImagePreview } from '@components/note/preview/image';
import { MessageImagePreview } from '@components/note/preview/messageImage';
import { VideoPreview } from '@components/note/preview/video';
import { NoteQuote } from '@components/note/quote';
import { UserMention } from '@components/user/mention';

import destr from 'destr';
import reactStringReplace from 'react-string-replace';

export const contentParser = (noteContent, noteTags) => {
  let parsedContent = noteContent;

  // get data tags
  const tags = destr(noteTags);
  // handle urls
  parsedContent = reactStringReplace(parsedContent, /(https?:\/\/\S+)/g, (match, i) => {
    if (match.match(/\.(jpg|jpeg|gif|png|webp)$/i)) {
      // image url
      return <ImagePreview key={match + i} url={match} />;
    } else if (match.match(/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i)) {
      // youtube
      return <VideoPreview key={match + i} url={match} />;
    } else if (match.match(/\.(mp4|webm)$/i)) {
      // video
      return <VideoPreview key={match + i} url={match} />;
    } else {
      return (
        <a key={match + i} href={match} target="_blank" rel="noreferrer">
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
  if (tags.length > 0) {
    parsedContent = reactStringReplace(parsedContent, /\#\[(\d+)\]/gm, (match) => {
      if (tags[match][0] === 'p') {
        // @-mentions
        return <UserMention key={tags[match][1]} pubkey={tags[match][1]} />;
      } else if (tags[match][0] === 'e') {
        // note-quotes
        return <NoteQuote key={tags[match][1]} id={tags[match][1]} />;
      } else {
        return;
      }
    });
  }

  return parsedContent;
};

export const messageParser = (noteContent) => {
  let parsedContent = noteContent;

  // handle urls
  parsedContent = reactStringReplace(parsedContent, /(https?:\/\/\S+)/g, (match, i) => {
    if (match.match(/\.(jpg|jpeg|gif|png|webp)$/i)) {
      // image url
      return <MessageImagePreview key={match + i} url={match} />;
    } else if (match.match(/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i)) {
      // youtube
      return <VideoPreview key={match + i} url={match} />;
    } else if (match.match(/\.(mp4|webm)$/i)) {
      // video
      return <VideoPreview key={match + i} url={match} />;
    } else {
      return (
        <a key={match + i} href={match} target="_blank" rel="noreferrer">
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
