export function fileType(url: string) {
  if (url.match(/\.(jpg|jpeg|gif|png|webp|avif|tiff)$/)) {
    return 'image';
  }

  if (url.match(/\.(mp4|mov|webm|wmv|flv|mts|avi|ogv|mkv|mp3|m3u8)$/)) {
    return 'video';
  }

  return 'link';
}
