import { Event, parseReferences } from 'nostr-tools';

const getURLs = new RegExp(
  '(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))',
  'g'
);

export const noteParser = (event: Event) => {
  const references = parseReferences(event);
  const content = { original: event.content, parsed: event.content, images: [], videos: [], others: [] };

  // handle media
  content.original.match(getURLs)?.forEach((url) => {
    if (url.match(/\.(jpg|jpeg|gif|png|webp|avif)$/i)) {
      // image url
      content.images.push(url.trim());
      // remove url from original content
      content.parsed = content.parsed.replace(url, '');
    } else if (url.match(/(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?/)) {
      // youtube
      content.videos.push(url.trim());
      // remove url from original content
      content.parsed = content.parsed.replace(url, '');
    } else if (url.match(/\.(mp4|webm|mov)$/i)) {
      // video
      content.videos.push(url.trim());
      // remove url from original content
      content.parsed = content.parsed.replace(url, '');
    } else {
      content.others.push(url.trim());
    }
  });

  // handle note references
  references?.forEach((reference) => {
    if (reference?.profile) {
      content.parsed.replace(reference.text, `<NoteMentionUser pubkey="${reference.profile.pubkey}" />`);
    }
    if (reference?.event) {
      content.parsed.replace(reference.text, `<NoteQuote id="${reference.event.id}" />;`);
    }
    if (reference?.address) {
      content.parsed.replace(reference.text, `<a href="${reference.address}" target="_blank" />`);
    }
  });

  return content;
};
