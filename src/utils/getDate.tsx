// get X days ago with user provided date
export function daysAgo(numOfDays, date = new Date()) {
  const daysAgo = new Date(date.getTime());
  daysAgo.setDate(date.getDate() - numOfDays);

  return daysAgo;
}

// get X hours ago with user provided date
export function hoursAgo(numOfHours, date = new Date()) {
  const hoursAgo = new Date(date.getTime());
  hoursAgo.setHours(date.getHours() - numOfHours);

  return hoursAgo;
}

// convert date to unix timestamp
export function dateToUnix(_date?: Date) {
  const date = _date || new Date();

  return Math.floor(date.getTime() / 1000);
}
