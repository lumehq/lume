import { NDKEvent } from '@nostr-dev-kit/ndk';
import getUrls from 'get-urls';
import { Event, parseReferences } from 'nostr-tools';

import { RichContent } from '@utils/types';

export function parser(event: NDKEvent) {
  if (event.kind !== 1) return;

  const references = parseReferences(event as unknown as Event);
  const urls = getUrls(event.content as unknown as string);

  const content: RichContent = {
    parsed: event.content as unknown as string,
    notes: [],
    images: [],
    videos: [],
    links: [],
  };

  // parse urls
  urls?.forEach((url: string) => {
    if (url.match(/\.(jpg|jpeg|gif|png|webp|avif)$/)) {
      // image url
      content.images.push(url);
      // remove url from original content
      content.parsed = content.parsed.replace(url, '');
    }

    if (url.match(/\.(mp4|mov|webm|wmv|flv|mts|avi|ogv|mkv|mp3|m3u8)$/)) {
      // video
      content.videos.push(url);
      // remove url from original content
      content.parsed = content.parsed.replace(url, '');
    }

    /*
    if (content.links.length < 1) {
      // push to store
      content.links.push(url);
      // remove url from original content
      content.parsed = content.parsed.replace(url, '');
    }
    */
  });

  // parse hashtag
  const hashtags = content.parsed.split(/\s/gm).filter((s) => s.startsWith('#'));
  hashtags?.forEach((tag) => {
    content.parsed = content.parsed.replace(tag, `~tag${tag}~`);
  });

  // parse nostr
  references?.forEach((item) => {
    const profile = item.profile;
    const event = item.event;
    const addr = item.address;
    if (event) {
      content.notes.push(event.id);
      content.parsed = content.parsed.replace(item.text, '');
    }
    if (profile) {
      content.parsed = content.parsed.replace(item.text, `~pub${item.profile.pubkey}~`);
    }
    if (addr) {
      content.notes.push(addr.identifier);
      content.parsed = content.parsed.replace(item.text, '');
    }
  });

  return content;
}
