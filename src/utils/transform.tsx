import destr from 'destr';

export const tagsToArray = (arr) => {
  const newarr = [];
  // push item to newarr
  arr.forEach((item) => {
    newarr.push(item[1]);
  });
  return newarr;
};

// convert array to NIP-02 tag list
export const arrayToNIP02 = (arr: string[]) => {
  const nip03_array = [];
  arr.forEach((item) => {
    nip03_array.push(['p', item]);
  });
  return nip03_array;
};

export const pubkeyArray = (arr) => {
  const newarr = [];
  // push item to newarr
  arr.forEach((item) => {
    newarr.push(item.pubkey);
  });
  return newarr;
};

export const getParentID = (arr, fallback) => {
  const tags = destr(arr);
  let parentID = fallback;

  if (tags.length > 0) {
    if (tags[0][0] === 'e' || tags[0][2] === 'root' || tags[0][3] === 'root') {
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

export const filterDuplicateParentID = (arr) => {
  const filteredArray = arr.filter(
    (item, index) => index === arr.findIndex((other) => item.parent_id === other.parent_id)
  );

  return filteredArray;
};
