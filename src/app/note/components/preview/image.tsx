export default function ImagePreview({ urls }: { urls: string[] }) {
  return (
    <div className="mt-2 grid h-full w-full grid-cols-2">
      {urls.length === 1 ? (
        <div className="col-span-2">
          <img
            src={urls[0]}
            alt="image"
            className="h-auto w-full rounded-lg object-cover"
            loading="lazy"
            decoding="async"
            style={{ contentVisibility: 'auto' }}
          />
        </div>
      ) : (
        urls.map((url: string) => (
          <div key={url} className="col-span-1">
            <img
              src={url}
              alt="image"
              className="h-auto w-full rounded-lg object-cover"
              loading="lazy"
              decoding="async"
              style={{ contentVisibility: 'auto' }}
            />
          </div>
        ))
      )}
    </div>
  );
}
