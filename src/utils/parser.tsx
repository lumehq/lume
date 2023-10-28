import { nip19 } from 'nostr-tools';
import {
  AddressPointer,
  EventPointer,
  ProfilePointer,
} from 'nostr-tools/lib/types/nip19';
import { Link } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';

import { Boost, Hashtag, Invoice, MentionUser } from '@shared/notes';

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
  const content: RichContent = {
    parsed: null,
    images: [],
    videos: [],
    links: [],
    notes: [],
  };

  const parsed = eventContent.split(/\s/gm).map((word) => {
    // nostr note references
    if (word.startsWith('nostr:note1') || word.startsWith('note1')) {
      const note = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
      content.notes.push(nip19.decode(note).data as string);
      return word.replace(word, ' ');
    }

    // nostr event references
    if (word.startsWith('nostr:nevent1') || word.startsWith('nevent1')) {
      const nevent = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
      const decoded = nip19.decode(nevent).data as EventPointer;
      content.notes.push(decoded.id);
      return word.replace(word, ' ');
    }

    // url
    if (isURL(word)) {
      const url = new URL(word);
      url.search = '';

      if (url.pathname.match(/\.(jpg|jpeg|gif|png|webp|avif)$/)) {
        // image url
        content.images.push(word);
        // remove url from original content
        return word.replace(word, ' ');
      }

      if (url.pathname.match(/\.(mp4|mov|webm|wmv|flv|mts|avi|ogv|mkv|mp3|m3u8)$/)) {
        // video url
        content.videos.push(word);
        // remove url from original content
        return word.replace(word, ' ');
      }

      // normal url
      if (content.links.length < 1) {
        content.links.push(url.toString());
        return word.replace(word, ' ');
      } else {
        return reactStringReplace(word, word, (match, i) => (
          <>
            {' '}
            <Link key={match + i} to={word} target="_blank" rel="noreferrer">
              {word}
            </Link>{' '}
          </>
        ));
      }
    }

    // hashtag
    if (word.startsWith('#') && word.length > 1) {
      return reactStringReplace(word, word, (match, i) => (
        <>
          {' '}
          <Hashtag key={match + i} tag={match} />{' '}
        </>
      ));
    }

    // boost
    if (word.startsWith('$prism') && word.length > 1) {
      return reactStringReplace(word, word, (match, i) => (
        <>
          {' '}
          <Boost key={match + i} boost={match} />{' '}
        </>
      ));
    }

    // nostr account references (depreciated)
    if (word.startsWith('@npub1')) {
      const npub = word.replace('@', '').replace(/[^a-zA-Z0-9 ]/g, '');
      return reactStringReplace(word, word, (match, i) => (
        <>
          {' '}
          <MentionUser key={match + i} pubkey={nip19.decode(npub).data as string} />{' '}
        </>
      ));
    }

    // nostr account references
    if (word.startsWith('nostr:npub1') || word.startsWith('npub1')) {
      const npub = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
      return reactStringReplace(word, word, (match, i) => (
        <>
          {' '}
          <MentionUser key={match + i} pubkey={nip19.decode(npub).data as string} />{' '}
        </>
      ));
    }

    // nostr profile references
    if (word.startsWith('nostr:nprofile1') || word.startsWith('nprofile1')) {
      const nprofile = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
      const decoded = nip19.decode(nprofile).data as ProfilePointer;
      return reactStringReplace(word, word, (match, i) => (
        <>
          {' '}
          <MentionUser key={match + i} pubkey={decoded.pubkey} />{' '}
        </>
      ));
    }

    // nostr address references
    if (word.startsWith('nostr:naddr1') || word.startsWith('naddr1')) {
      const naddr = word.replace('nostr:', '').replace(/[^a-zA-Z0-9 ]/g, '');
      const decoded = nip19.decode(naddr).data as AddressPointer;
      return reactStringReplace(word, word, (match, i) => (
        <>
          {' '}
          <MentionUser key={match + i} pubkey={decoded.pubkey} />{' '}
        </>
      ));
    }

    // lightning invoice
    if (word.startsWith('lnbc') && word.length > 60) {
      return reactStringReplace(word, word, (match, i) => (
        <>
          {' '}
          <Invoice key={match + i} invoice={word} />{' '}
        </>
      ));
    }

    // normal word
    return ' ' + word + ' ';
  });

  // update content with parsed version
  content.parsed = parsed;
  return content;
}
