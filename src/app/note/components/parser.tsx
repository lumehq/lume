import { NoteQuote } from '@lume/app/note/components/quote';
import { NoteMentionUser } from '@lume/app/note/components/user/mention';

import { Event, parseReferences } from 'nostr-tools';
import reactStringReplace from 'react-string-replace';

const getURLs = new RegExp(
  '(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal|wss|ws):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))',
  'gmi'
);

export const noteParser = (event: Event) => {
  const references = parseReferences(event);
  const content: { original: string; parsed: any; images: string[]; videos: string[] } = {
    original: event.content,
    parsed: event.content,
    images: [],
    videos: [],
  };

  // handle media
  content.original.match(getURLs)?.forEach((item) => {
    // make sure url is trimmed
    const url = item.trim();

    if (url.match(/\.(jpg|jpeg|gif|png|webp|avif)$/gim)) {
      // image url
      content.images.push(url);
      // remove url from original content
      content.parsed = content.parsed.replace(url, '');
    } else if (url.match(/\.(mp4|webm|mov)$/i)) {
      // video
      content.videos.push(url);
      // remove url from original content
      content.parsed = content.parsed.replace(url, '');
    }
  });

  // handle hashtag
  content.parsed = reactStringReplace(content.parsed, /#(\w+)/g, (match, i) => (
    <span key={match + i} className="cursor-pointer text-fuchsia-500 hover:text-fuchsia-600">
      #{match}
    </span>
  ));

  // handle note references
  references?.forEach((reference) => {
    if (reference?.profile) {
      content.parsed = reactStringReplace(content.parsed, reference.text, () => {
        return <NoteMentionUser key={reference.profile.pubkey} pubkey={reference.profile.pubkey} />;
      });
    }
    if (reference?.event) {
      content.parsed = reactStringReplace(content.parsed, reference.text, () => {
        return <NoteQuote key={reference.event.id} id={reference.event.id} />;
      });
    }
  });

  return content;
};
