import { nip19 } from 'nostr-tools';
import {
  AddressPointer,
  EventPointer,
  ProfilePointer,
} from 'nostr-tools/lib/types/nip19';

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

export function parser(content: string) {
  const richContent: RichContent = {
    parsed: null,
    images: [],
    videos: [],
    links: [],
    notes: [],
  };

  const parsed = content
    .trim()
    .split(/(\s+)/)
    .map((word) => {
      // url
      if (isURL(word)) {
        const url = new URL(word);
        url.search = '';

        if (url.pathname.match(/\.(jpg|jpeg|gif|png|webp|avif)$/)) {
          // image url
          richContent.images.push(word);
          // remove url from original content
          return word.replace(word, '');
        }

        if (url.pathname.match(/\.(mp4|mov|webm|wmv|flv|mts|avi|ogv|mkv|mp3|m3u8)$/)) {
          // video url
          richContent.videos.push(word);
          // remove url from original content
          return word.replace(word, '');
        }

        // normal url
        if (richContent.links.length < 1) {
          richContent.links.push(url.toString());
        }
      }

      // hashtag
      if (word.startsWith('#') && word.length > 1) {
        return word.replace(word, `<Hashtag tag='${word}' />`);
      }

      // boost
      if (word.startsWith('$prism') && word.length > 1) {
        return word.replace(word, `<Boost boost='${word}' />`);
      }

      // nostr account references (depreciated)
      if (word.startsWith('@npub1')) {
        const npub = word.replace('@', '').replace(/[^a-zA-Z0-9 ]/g, '');
        return word.replace(
          word,
          `<MentionUser pubkey='${nip19.decode(npub).data as string}' />`
        );
      }

      // nostr account references
      if (word.startsWith('nostr:npub1') || word.startsWith('npub1')) {
        const npub = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
        return word.replace(
          word,
          `<MentionUser pubkey='${nip19.decode(npub).data as string}' />`
        );
      }

      // nostr profile references
      if (word.startsWith('nostr:nprofile1') || word.startsWith('nprofile1')) {
        const nprofile = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
        const decoded = nip19.decode(nprofile).data as ProfilePointer;
        return word.replace(word, `<MentionUser pubkey='${decoded.pubkey}' />`);
      }

      // nostr address references
      if (word.startsWith('nostr:naddr1') || word.startsWith('naddr1')) {
        const naddr = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
        const decoded = nip19.decode(naddr).data as AddressPointer;
        return word.replace(word, `<MentionUser pubkey='${decoded.pubkey}' />`);
      }

      // lightning invoice
      if (word.startsWith('lnbc') && word.length > 60) {
        return word.replace(word, `<Invoice invoice='${word}' />`);
      }

      // nostr note references
      if (word.startsWith('nostr:note1') || word.startsWith('note1')) {
        const note = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
        richContent.notes.push(nip19.decode(note).data as string);
        return word.replace(word, '');
      }

      // nostr event references
      if (word.startsWith('nostr:nevent1') || word.startsWith('nevent1')) {
        const nevent = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
        const decoded = nip19.decode(nevent).data as EventPointer;
        richContent.notes.push(decoded.id);
        return word.replace(word, '');
      }

      return word;
    });

  // update content with parsed version
  richContent.parsed = parsed.join(' ').trim();
  return richContent;
}
