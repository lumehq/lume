export function fileType(url: string) {
  if (url.match(/\.(jpg|jpeg|gif|png|webp|avif|tiff)$/)) {
    return 'image';
  }

  if (url.match(/\.(mp4|mov|webm|wmv|flv|mts|avi|ogv|mkv)$/)) {
    return 'video';
  }

  if (url.match(/\.(mp3|ogg|wav)$/)) {
    return 'audio';
  }

  return 'link';
}
