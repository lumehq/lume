import { Image } from '@shared/image';

export function ImagePreview({ urls, truncate }: { urls: string[]; truncate?: boolean }) {
  return (
    <div className="mb-2 mt-3 max-w-[420px] overflow-hidden">
      <div className="flex flex-col gap-2">
        {urls.map((url) => (
          <div key={url} className="relative min-w-0 shrink-0 grow-0 basis-full">
            <Image
              src={url}
              fallback="https://void.cat/d/XTmrMkpid8DGLjv1AzdvcW"
              alt="image"
              className={`${
                truncate ? 'h-auto max-h-[300px]' : 'h-auto'
              } w-full rounded-lg border border-zinc-800/50 object-cover`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
