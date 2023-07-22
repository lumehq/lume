import getUrls from 'get-urls';
import { Event, parseReferences } from 'nostr-tools';
import ReactPlayer from 'react-player';

import { LumeEvent } from '@utils/types';

export function parser(event: LumeEvent) {
  const references = parseReferences(event as Event);
  const urls = getUrls(event.content);

  const content: {
    original: string;
    parsed: string;
    notes: string[];
    images: string[];
    videos: string[];
    links: string[];
  } = {
    original: event.content,
    parsed: event.content,
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
    } else if (ReactPlayer.canPlay(url)) {
      // video
      content.videos.push(url);
      // remove url from original content
      content.parsed = content.parsed.replace(url, '');
    } else {
      if (content.links.length < 1) {
        // push to store
        content.links.push(url);
        // remove url from original content
        content.parsed = content.parsed.replace(url, '');
      }
    }
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
    if (event) {
      content.notes.push(event.id);
      content.parsed = content.parsed.replace(item.text, '');
    }
    if (profile) {
      content.parsed = content.parsed.replace(item.text, `~pub${item.profile.pubkey}~`);
    }
  });

  return content;
}
