export const tagsToArray = (arr) => {
  const newarr = [];
  // push item to newarr
  arr.forEach((item) => {
    newarr.push(item[1]);
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
