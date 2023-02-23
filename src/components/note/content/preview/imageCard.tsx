import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ImageCard({ data }: { data: object }) {
  return (
    <div className={`relative mt-2 flex flex-col overflow-hidden`}>
      <div className="relative h-full w-2/3 rounded-lg border border-zinc-800">
        <Image
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
}
