import Image from 'next/image';
import { memo } from 'react';

export const ImagePreview = memo(function ImagePreview({ url }: { url: string }) {
  return (
    <div className="relative mt-3 mb-2 h-full w-full rounded-lg xl:w-2/3">
      <Image
        src={url}
        alt={url}
        width="0"
        height="0"
        sizes="100vw"
        className="h-auto w-full rounded-lg border border-zinc-800 object-cover"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
        priority
      />
    </div>
  );
});
