import { nip19 } from 'nostr-tools';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';

import { Hashtag, MentionNote, MentionUser } from '@shared/notes';

const NOSTR_MENTIONS = [
  '@npub1',
  'nostr:npub1',
  'nostr:nprofile1',
  'nostr:naddr1',
  'npub1',
  'nprofile1',
  'naddr1',
];

const NOSTR_EVENTS = ['nostr:note1', 'note1', 'nostr:nevent1', 'nevent1'];

// const BITCOINS = ['lnbc', 'bc1p', 'bc1q'];

const IMAGES = ['.jpg', '.jpeg', '.gif', '.png', '.webp', '.avif', '.tiff'];

const VIDEOS = [
  '.mp4',
  '.mov',
  '.webm',
  '.wmv',
  '.flv',
  '.mts',
  '.avi',
  '.ogv',
  '.mkv',
  '.mp3',
  '.m3u8',
];

export function useRichContent(content: string) {
  let parsedContent: string | ReactNode[] = content;
  let linkPreview: string;

  const text = content;
  const words = text.split(/(\s+)/);

  const images = words
    .filter((word) => IMAGES.some((el) => word.endsWith(el)))
    .map((item: string) => item);

  const videos = words
    .filter((word) => VIDEOS.some((el) => word.endsWith(el)))
    .map((item: string) => item);

  const hashtags = words.filter((word) => word.startsWith('#'));
  const events = words.filter((word) => NOSTR_EVENTS.some((el) => word.startsWith(el)));

  const mentions = words.filter((word) =>
    NOSTR_MENTIONS.some((el) => word.startsWith(el))
  );

  try {
    if (images.length) {
      images.forEach((image) => {
        // @ts-expect-error, it is string at this time
        parsedContent = parsedContent.replace(image, '');
      });
    }

    if (videos.length) {
      videos.forEach((video) => {
        // @ts-expect-error, it is string at this time
        parsedContent = parsedContent.replace(video, '');
      });
    }

    if (hashtags.length) {
      hashtags.forEach((hashtag) => {
        parsedContent = reactStringReplace(parsedContent, hashtag, (match, i) => (
          <Hashtag key={match + i} tag={hashtag} />
        ));
      });
    }

    if (events.length) {
      events.forEach((event) => {
        const address = event.replace('nostr:', '');
        const decoded = nip19.decode(address);

        if (decoded.type === 'note') {
          parsedContent = reactStringReplace(parsedContent, event, (match, i) => (
            <MentionNote key={match + i} id={decoded.data} />
          ));
        }

        if (decoded.type === 'nevent') {
          parsedContent = reactStringReplace(parsedContent, event, (match, i) => (
            <MentionNote key={match + i} id={decoded.data.id} />
          ));
        }
      });
    }

    if (mentions.length) {
      mentions.forEach((mention) => {
        const address = mention.replace('nostr:', '').replace('@', '');
        const decoded = nip19.decode(address);

        if (decoded.type === 'npub') {
          parsedContent = reactStringReplace(parsedContent, mention, (match, i) => (
            <MentionUser key={match + i} pubkey={decoded.data} />
          ));
        }

        if (decoded.type === 'nprofile' || decoded.type === 'naddr') {
          parsedContent = reactStringReplace(parsedContent, mention, (match, i) => (
            <MentionUser key={match + i} pubkey={decoded.data.pubkey} />
          ));
        }
      });
    }

    parsedContent = reactStringReplace(parsedContent, /(https?:\/\/\S+)/g, (match, i) => {
      if (!linkPreview) {
        linkPreview = match;
        if (content.length < 500) return null;
      }

      const url = new URL(match);
      url.search = '';

      return (
        <Link
          key={match + i}
          to={url}
          target="_blank"
          rel="noreferrer"
          className="break-all font-normal text-blue-500 hover:text-blue-600"
        >
          {url.toString()}
        </Link>
      );
    });

    if (typeof parsedContent[0] === 'string') {
      parsedContent[0] = parsedContent[0].trim();
    }

    return { parsedContent, images, videos, linkPreview };
  } catch (e) {
    console.warn('[parser] parse failed: ', e);
    return { parsedContent, images, videos, linkPreview };
  }
}
