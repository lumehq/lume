export function isImage(url: string) {
  return /\.(jpg|jpeg|gif|png|webp|avif)$/.test(url);
}
