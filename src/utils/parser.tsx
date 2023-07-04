import destr from 'destr';
import getUrls from 'get-urls';
import { parseReferences } from 'nostr-tools';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';

import { MentionUser } from '@shared/notes/mentions/user';

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function parser(event: any) {
  if (isJsonString(event.tags)) {
    event['tags'] = destr(event.tags);
  }

  const references = parseReferences(event);
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
    parsed: event.content,
    notes: [],
    images: [],
    videos: [],
    links: [],
  };

  // remove unnecessary whitespaces
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  content.parsed = content.parsed.replace(/\s{2,}/g, ' ');

  // remove unnecessary linebreak
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  content.parsed = content.parsed.replace(/(\r\n|\r|\n){2,}/g, '$1\n');

  // parse urls
  urls?.forEach((url: string) => {
    if (url.match(/\.(jpg|jpeg|gif|png|webp|avif)$/)) {
      // image url
      content.images.push(url);
      // remove url from original content
      content.parsed = reactStringReplace(content.parsed, url, () => null);
    } else if (url.match(/\.(mp4|webm|mov|ogv|avi|mp3)$/)) {
      // video
      content.videos.push(url);
      // remove url from original content
      content.parsed = reactStringReplace(content.parsed, url, () => null);
    } else {
      if (content.links.length < 1) {
        // push to store
        content.links.push(url);
        // remove url from original content
        content.parsed = reactStringReplace(content.parsed, url, () => null);
      } else {
        content.parsed = reactStringReplace(content.parsed, /#(\w+)/g, (match, i) => (
          <Link
            key={match + i}
            to={match}
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
    <Link
      key={match + i}
      to={`/search/${match}`}
      className="font-normal text-fuchsia-500 no-underline hover:text-fuchsia-600"
    >
      #{match}
    </Link>
  ));

  // clean array
  content.parsed = content.parsed.filter((el) => el !== '\n');

  return content;
}
