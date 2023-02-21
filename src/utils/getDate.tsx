export const daysAgo = (numOfDays, date = new Date()) => {
  const daysAgo = new Date(date.getTime());
  daysAgo.setDate(date.getDate() - numOfDays);

  return daysAgo;
};

export const hoursAgo = (numOfHours, date = new Date()) => {
  const hoursAgo = new Date(date.getTime());
  hoursAgo.setHours(date.getHours() - numOfHours);

  return hoursAgo;
};
