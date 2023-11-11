import { downloadDir } from '@tauri-apps/api/path';
import { download } from '@tauri-apps/plugin-upload';
import { SyntheticEvent } from 'react';
import Zoom from 'react-medium-image-zoom';

import { CancelIcon, DownloadIcon } from '@shared/icons';

export function ImagePreview({ url }: { url: string }) {
  const downloadImage = async (url: string) => {
    const downloadDirPath = await downloadDir();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return await download(url, downloadDirPath + `/${filename}`);
  };

  const fallback = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/fallback-image.jpg';
  };

  return (
    <Zoom key={url} zoomMargin={50} IconUnzoom={() => <CancelIcon className="h-4 w-4" />}>
      <div className="group relative my-2">
        <img
          src={url}
          alt={url}
          loading="lazy"
          decoding="async"
          style={{ contentVisibility: 'auto' }}
          onError={fallback}
          className="h-auto w-full rounded-lg border border-neutral-300/50 object-cover dark:border-neutral-700/50"
        />
        <button
          type="button"
          onClick={() => downloadImage(url)}
          className="absolute right-2 top-2 hidden h-10 w-10 items-center justify-center rounded-lg bg-black/50 backdrop-blur-xl group-hover:inline-flex hover:bg-blue-500"
        >
          <DownloadIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    </Zoom>
  );
}
