import { nip19 } from 'nostr-tools';
import { EventPointer } from 'nostr-tools/lib/nip19';

import { RichContent } from '@utils/types';

function isURL(string: string) {
  try {
    const url = new URL(string);
    if (url.protocol.length > 0) {
      if (url.protocol === 'https:' || url.protocol === 'http:') {
        return true;
      } else {
        return false;
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}

export function parser(eventContent: string) {
  try {
    const content: RichContent = {
      parsed: null,
      images: [],
      videos: [],
      links: [],
      notes: [],
    };

    const parse = eventContent.split(/\s/gm).map((word) => {
      // url
      if (isURL(word)) {
        const url = new URL(word);
        url.search = '';

        if (url.pathname.match(/\.(jpg|jpeg|gif|png|webp|avif)$/)) {
          // image url
          content.images.push(word);
          // remove url from original content
          return word.replace(word, '');
        }

        if (url.pathname.match(/\.(mp4|mov|webm|wmv|flv|mts|avi|ogv|mkv|mp3|m3u8)$/)) {
          // video
          content.videos.push(word);
          // remove url from original content
          return word.replace(word, '');
        }

        content.links.push(url.toString());
      }

      // hashtag
      if (word.startsWith('#') && word.length > 1) {
        return word.replace(word, `~tag-${word}~`);
      }

      // nostr account references
      if (word.startsWith('nostr:npub1')) {
        const npub = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
        return word.replace(word, `~pub-${nip19.decode(npub).data}~`);
      }

      // nostr account references
      if (word.startsWith('nostr:note1')) {
        const note = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
        content.notes.push(nip19.decode(note).data as string);
        return word.replace(word, '');
      }

      // nostr event references
      if (word.startsWith('nostr:nevent1')) {
        const nevent = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
        const decoded = nip19.decode(nevent).data as EventPointer;
        content.notes.push(decoded.id);
        return word.replace(word, '');
      }

      // normal word
      return word;
    });

    // update content with parsed version
    content.parsed = parse.join(' ');

    return content;
  } catch (e) {
    console.error('cannot parse content, error: ', e);
  }
}
