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
    <div className="flex w-full flex-col gap-2">
      {urls.map((url) => (
        <div key={url} className="group relative">
          <img
            src={url}
            alt={url}
            className="h-auto w-full rounded-lg border border-neutral-300 object-cover dark:border-neutral-700"
          />
          <button
            type="button"
            onClick={() => downloadImage(url)}
            className="absolute right-2 top-2 hidden h-10 w-10 items-center justify-center rounded-lg bg-black/50 backdrop-blur-xl group-hover:inline-flex hover:bg-blue-500"
          >
            <DownloadIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
}
