import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ImageCard({ data }: { data: object }) {
  return (
    <div
      className={`relative mt-2 flex flex-col overflow-hidden rounded-xl border border-zinc-800`}>
      <div className="relative h-full w-full">
        <Image
          src={data['image']}
          alt={data['image']}
          width="0"
          height="0"
          sizes="100vw"
          className="h-auto w-full object-cover"
        />
      </div>
    </div>
  );
}
