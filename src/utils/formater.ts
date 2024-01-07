import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { nip19 } from 'nostr-tools';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    past: '%s ago',
    s: 'just now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
  },
});

export function formatCreatedAt(time: number, message: boolean = false) {
  let formated: string;

  const now = dayjs();
  const inputTime = dayjs.unix(time);
  const diff = now.diff(inputTime, 'hour');

  if (message) {
    if (diff < 12) {
      formated = inputTime.format('HH:mm A');
    } else {
      formated = inputTime.format('MMM DD');
    }
  } else {
    if (diff < 24) {
      formated = inputTime.from(now, true);
    } else {
      formated = inputTime.format('MMM DD');
    }
  }

  return formated;
}

export function displayNpub(pubkey: string, len: number = 16, separator?: string) {
  const npub = pubkey.startsWith('npub1') ? pubkey : (nip19.npubEncode(pubkey) as string);

  return cropText(npub, len, separator);
}

export function cropText(text: string, len: number = 16, separator?: string) {
  if (text.length <= len) return text;

  separator = separator || ' ... ';

  const sepLen = separator.length,
    charsToShow = len - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return text.substr(0, frontChars) + separator + text.substr(text.length - backChars);
}

// convert number to K, M, B, T, etc.
export const compactNumber = Intl.NumberFormat('en', { notation: 'compact' });
