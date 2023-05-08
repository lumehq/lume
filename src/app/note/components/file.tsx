import { Image } from '@lume/shared/image';

export default function NoteFile({ url }: { url: string }) {
  return (
    <div className="mt-3 grid h-full w-full grid-cols-3">
      <div className="col-span-3">
        <Image
          src={url}
          alt="image"
          className="h-auto w-full rounded-lg object-cover"
          style={{ contentVisibility: 'auto' }}
        />
      </div>
    </div>
  );
}
