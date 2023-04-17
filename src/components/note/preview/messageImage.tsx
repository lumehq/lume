import Image from 'next/image';
import { memo } from 'react';

export const MessageImagePreview = memo(function MesssageImagePreview({ url }: { url: string }) {
  return (
    <div className="relative mb-2 mt-3 h-full w-2/3 rounded-lg border border-zinc-800 xl:w-2/3">
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
