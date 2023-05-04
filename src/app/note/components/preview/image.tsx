import { Image } from '@lume/shared/image';

export default function ImagePreview({ urls }: { urls: string[] }) {
  return (
    <div className="mt-2 grid h-full w-full grid-cols-2">
      {urls.length === 1 ? (
        <div className="col-span-2">
          <Image
            src={urls[0]}
            alt="image"
            className="h-auto w-full rounded-lg object-cover"
            style={{ contentVisibility: 'auto' }}
          />
        </div>
      ) : (
        urls.map((url: string) => (
          <div key={url} className="col-span-1">
            <Image
              src={url}
              alt="image"
              className="h-auto w-full rounded-lg object-cover"
              style={{ contentVisibility: 'auto' }}
            />
          </div>
        ))
      )}
    </div>
  );
}
