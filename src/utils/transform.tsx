import { NDKTag } from '@nostr-dev-kit/ndk';

// convert array to NIP-02 tag list
export function arrayToNIP02(arr: string[]) {
  const nip02_arr = [];
  arr.forEach((item) => {
    nip02_arr.push(['p', item]);
  });

  return nip02_arr;
}

// get repost id from event tags
export function getRepostID(tags: NDKTag[]) {
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
