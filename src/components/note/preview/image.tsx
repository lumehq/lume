import Image from 'next/image';
import { memo } from 'react';

export const ImagePreview = memo(function ImagePreview({ url, size }: { url: string; size: string }) {
  return (
    <div className={`relative h-full ${size === 'large' ? 'w-4/5' : 'w-1/2'} mt-2 rounded-lg border border-zinc-800`}>
      <Image
        src={url}
        alt={url}
        width="0"
        height="0"
        sizes="100vw"
        className="h-auto w-full rounded-lg object-cover"
        priority
      />
    </div>
  );
});
