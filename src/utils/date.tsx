// get X days ago with user provided date
export function getDayAgo(numOfDays, date = new Date()) {
  const days = new Date(date.getTime());
  days.setDate(date.getDate() - numOfDays);

  return days;
}

// get X hours ago with user provided date
export function getHourAgo(numOfHours, date = new Date()) {
  const hours = new Date(date.getTime());
  hours.setHours(date.getHours() - numOfHours);

  return hours;
}

// convert date to unix timestamp
export function dateToUnix(_date?: Date) {
  const date = _date || new Date();

  return Math.floor(date.getTime() / 1000);
}
