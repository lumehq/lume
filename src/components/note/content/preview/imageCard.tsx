import Image from 'next/image';
import { memo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ImageCard = memo(function ImageCard({ data }: { data: object }) {
  return (
    <div className={`relative mt-2 flex flex-col overflow-hidden`}>
      <div className="relative h-full w-full rounded-lg border border-zinc-800">
        <Image
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
          src={data['image']}
          alt={data['image']}
          width="0"
          height="0"
          sizes="100vw"
          className=" h-auto w-full rounded-lg object-cover"
        />
      </div>
    </div>
  );
});
