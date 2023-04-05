import destr from 'destr';

export const tagsToArray = (arr) => {
  const newarr = [];
  // push item to newarr
  arr.forEach((item) => {
    newarr.push(item[1]);
  });
  return newarr;
};

export const followsTag = (arr) => {
  const newarr = [];
  // push item to tags
  arr.forEach((item) => {
    newarr.push(['p', item]);
  });
  return newarr;
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

export const filteredData = (obj) => {
  const filteredArr = obj.reduce((item, current) => {
    const x = item.find((item) => item.parent_id === current.parent_id);
    if (!x) {
      return item.concat([current]);
    } else {
      return item;
    }
  }, []);

  return filteredArr;
};
