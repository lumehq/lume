import destr from 'destr';

// convert NIP-02 to array of pubkey
export const nip02ToArray = (tags: any) => {
  const arr = [];
  tags.forEach((item) => {
    arr.push(item[1]);
  });

  return arr;
};

// convert array to NIP-02 tag list
export const arrayToNIP02 = (arr: string[]) => {
  const nip02_arr = [];
  arr.forEach((item) => {
    nip02_arr.push(['p', item]);
  });

  return nip02_arr;
};

// convert array object to pure array
export const arrayObjToPureArr = (arr: any) => {
  const pure_arr = [];
  arr.forEach((item) => {
    pure_arr.push(item.content);
  });

  return pure_arr;
};

// get parent id from event tags
export const getParentID = (arr: string[], fallback: string) => {
  const tags = destr(arr);
  let parentID = fallback;

  if (tags.length > 0) {
    if (tags[0][0] === 'e') {
      parentID = tags[0][1];
    } else {
      tags.forEach((tag) => {
        if (tag[0] === 'e' && (tag[2] === 'root' || tag[3] === 'root')) {
          parentID = tag[1];
        }
      });
    }
  }

  return parentID;
};

// check id present in event tags
export const isTagsIncludeID = (id: string, arr: string[]) => {
  const tags = destr(arr);

  if (tags.length > 0) {
    if (tags[0][1] === id) {
      return true;
    }
  } else {
    return false;
  }
};

// get parent id from event tags
export const getQuoteID = (arr: string[]) => {
  const tags = destr(arr);
  let quoteID = null;

  if (tags.length > 0) {
    if (tags[0][0] === 'e') {
      quoteID = tags[0][1];
    } else {
      tags.forEach((tag) => {
        if (tag[0] === 'e') {
          quoteID = tag[1];
        }
      });
    }
  }

  return quoteID;
};

// sort events by timestamp
export const sortEvents = (arr: any) => {
  arr.sort((a, b) => {
    return a.created_at - b.created_at;
  });

  return arr;
};
