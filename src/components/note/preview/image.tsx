import Image from 'next/image';
import { memo } from 'react';

export const ImagePreview = memo(function ImagePreview({ data }: { data: any }) {
  return (
    <div className="relative mt-2 flex flex-col overflow-hidden">
      {data.map((image: string, index: number) => (
        <div key={index} className={`relative h-full w-full rounded-lg xl:w-2/3 ${index >= 1 ? 'mt-2' : ''}`}>
          <Image
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
            src={image}
            alt={image}
            width="0"
            height="0"
            sizes="100vw"
            className="h-auto w-full rounded-lg border border-zinc-800 object-cover"
          />
        </div>
      ))}
    </div>
  );
});
