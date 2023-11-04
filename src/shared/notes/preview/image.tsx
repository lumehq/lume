import { downloadDir } from '@tauri-apps/api/path';
import { download } from '@tauri-apps/plugin-upload';
import { SyntheticEvent } from 'react';
import Zoom from 'react-medium-image-zoom';

import { DownloadIcon } from '@shared/icons';

export function ImagePreview({ urls }: { urls: string[] }) {
  const downloadImage = async (url: string) => {
    const downloadDirPath = await downloadDir();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return await download(url, downloadDirPath + `/${filename}`);
  };

  const fallback = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/fallback-image.jpg';
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {urls.map((url) => (
        <Zoom key={url} zoomMargin={50}>
          <div className="group relative">
            <img
              src={url}
              alt={url}
              loading="lazy"
              decoding="async"
              style={{ contentVisibility: 'auto' }}
              onError={fallback}
              className="h-auto w-full rounded-lg border border-neutral-300 object-cover dark:border-neutral-700"
            />
            <button
              type="button"
              onClick={() => downloadImage(url)}
              className="absolute right-2 top-2 hidden h-10 w-10 items-center justify-center rounded-xl bg-black/50 backdrop-blur-xl group-hover:inline-flex hover:bg-blue-500"
            >
              <DownloadIcon className="h-4 w-4 text-white" />
            </button>
          </div>
        </Zoom>
      ))}
    </div>
  );
}
