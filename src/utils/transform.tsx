import { NDKTag } from '@nostr-dev-kit/ndk';
import { destr } from 'destr';

// convert array to NIP-02 tag list
export function arrayToNIP02(arr: string[]) {
  const nip02_arr = [];
  arr.forEach((item) => {
    nip02_arr.push(['p', item]);
  });

  return nip02_arr;
}

// get repost id from event tags
export function getRepostID(arr: NDKTag[]) {
  const tags = destr(arr) as string[];
  let quoteID = null;

  if (tags.length > 0) {
    if (tags[0][0] === 'e') {
      quoteID = tags[0][1];
    } else {
      quoteID = tags.find((t) => t[0] === 'e')?.[1];
    }
  }

  return quoteID;
}
