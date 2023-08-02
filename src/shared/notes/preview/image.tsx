import { downloadDir } from '@tauri-apps/api/path';
import { download } from '@tauri-apps/plugin-upload';

import { DownloadIcon } from '@shared/icons';
import { Image } from '@shared/image';

export function ImagePreview({ urls, truncate }: { urls: string[]; truncate?: boolean }) {
  const downloadImage = async (url: string) => {
    const downloadDirPath = await downloadDir();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return await download(url, downloadDirPath + `/${filename}`);
  };

  return (
    <div className="mb-2 mt-3 max-w-[420px] overflow-hidden">
      <div className="flex flex-col gap-2">
        {urls.map((url) => (
          <div key={url} className="group relative min-w-0 shrink-0 grow-0 basis-full">
            <Image
              src={url}
              fallback="https://void.cat/d/XTmrMkpid8DGLjv1AzdvcW"
              alt="image"
              className={`${
                truncate ? 'h-auto max-h-[300px]' : 'h-auto'
              } w-full rounded-lg border border-zinc-800/50 object-cover`}
            />
            <button
              type="button"
              onClick={() => downloadImage(url)}
              className="absolute right-2 top-2 hidden h-8 w-8 items-center justify-center rounded-md bg-black/50 backdrop-blur-md hover:bg-black/40 group-hover:inline-flex"
            >
              <DownloadIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
