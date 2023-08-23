export const nHoursAgo = (hrs: number): number =>
  Math.floor((Date.now() - hrs * 60 * 60 * 1000) / 1000);
