import getUrls from 'get-urls';
import { Event, parseReferences } from 'nostr-tools';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';

import { MentionUser } from '@shared/notes/mentions/user';

import { LumeEvent } from '@utils/types';

export function parser(event: LumeEvent) {
  const references = parseReferences(event as Event);
  const urls = getUrls(event.content);

  const content: {
    original: string;
    parsed: ReactNode[];
    notes: string[];
    images: string[];
    videos: string[];
    links: string[];
  } = {
    original: event.content,
    parsed: [event.content],
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
      content.parsed = reactStringReplace(content.parsed, url, () => '');
    } else if (url.match(/\.(mp4|webm|mov|ogv|avi|mp3)$/)) {
      // video
      content.videos.push(url);
      // remove url from original content
      content.parsed = reactStringReplace(content.parsed, url, () => '');
    } else {
      if (content.links.length < 1) {
        // push to store
        content.links.push(url);
        // remove url from original content
        content.parsed = reactStringReplace(content.parsed, url, () => '');
      } else {
        content.parsed = reactStringReplace(content.parsed, url, (match, i) => (
          <Link
            key={match + i}
            to={match}
            target="_blank"
            className="font-normal text-fuchsia-500 no-underline hover:text-fuchsia-600"
          >
            {match}
          </Link>
        ));
      }
    }
  });

  // parse nostr
  references?.forEach((item) => {
    const profile = item.profile;
    const event = item.event;
    if (event) {
      content.notes.push(event.id);
      content.parsed = reactStringReplace(content.parsed, item.text, () => null);
    }
    if (profile) {
      content.parsed = reactStringReplace(content.parsed, item.text, (match, i) => (
        <MentionUser key={match + i} pubkey={profile.pubkey} />
      ));
    }
  });

  // parse hashtag
  content.parsed = reactStringReplace(content.parsed, /#(\w+)/g, (match, i) => (
    <span
      key={match + i}
      className="font-normal text-fuchsia-500 no-underline hover:text-fuchsia-600"
    >
      #{match}
    </span>
  ));

  // clean array
  content.parsed = content.parsed.filter(
    (el) => el !== '\n' && el !== '\n\n' && el !== '\n'
  );

  return content;
}
