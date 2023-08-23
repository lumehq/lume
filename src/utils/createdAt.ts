import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

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

export function formatCreatedAt(time, message = false) {
  let formated;

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
