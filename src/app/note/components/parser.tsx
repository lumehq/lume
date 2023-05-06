import { Event } from 'nostr-tools';

const getURLs = new RegExp(
  '(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal|wss|ws):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))',
  'gmi'
);

export const noteParser = (event: Event) => {
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

    if (url.match(/\.(jpg|jpeg|gif|png|webp|avif)$/i)) {
      // image url
      content.images.push(url);
      // remove url from original content
      content.parsed = content.parsed.toString().replace(url, '');
    } else if (url.match(/\.(mp4|webm|mov)$/i)) {
      // video
      content.videos.push(url);
      // remove url from original content
      content.parsed = content.parsed.toString().replace(url, '');
    }
  });

  // map hashtag to em
  content.original.match(/#(\w+)(?!:\/\/)/gi)?.forEach((item) => {
    content.parsed = content.parsed.replace(item, `*${item}*`);
  });

  // map note mention to h6
  content.original.match(/^(nostr:)?(note1|nevent1).*$/gm)?.forEach((item) => {
    content.parsed = content.parsed.replace(item, `###### ${item}`);
  });

  // map profile mention to h5
  content.original.match(/^(nostr:)?(nprofile1|npub1).*$/gm)?.forEach((item) => {
    content.parsed = content.parsed.replace(item, `##### ${item}`);
  });

  return content;
};
