import { downloadDir } from '@tauri-apps/api/path';
import { download } from '@tauri-apps/plugin-upload';

import { DownloadIcon } from '@shared/icons';

export function ImagePreview({ urls }: { urls: string[] }) {
  const downloadImage = async (url: string) => {
    const downloadDirPath = await downloadDir();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return await download(url, downloadDirPath + `/${filename}`);
  };

  return (
    <div className="my-2 flex flex-col gap-2">
      {urls.map((url) => (
        <div key={url} className="group relative">
          <img
            src={url}
            alt="image"
            className="h-auto w-full rounded-lg border border-neutral-200 object-cover dark:border-neutral-800"
          />
          <button
            type="button"
            onClick={() => downloadImage(url)}
            className="absolute right-2 top-2 hidden h-8 w-8 items-center justify-center rounded-md bg-black/50 backdrop-blur-md group-hover:inline-flex hover:bg-black/40"
          >
            <DownloadIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
}
