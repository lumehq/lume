import { CheckCircleIcon, DownloadIcon } from "@lume/icons";
import { downloadDir } from "@tauri-apps/api/path";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { download } from "@tauri-apps/plugin-upload";
import { SyntheticEvent, useState } from "react";

export function ImagePreview({ url }: { url: string }) {
  const [downloaded, setDownloaded] = useState(false);

  const downloadImage = async (e: { stopPropagation: () => void }) => {
    try {
      e.stopPropagation();

      const downloadDirPath = await downloadDir();
      const filename = url.substring(url.lastIndexOf("/") + 1);
      await download(url, `${downloadDirPath}/${filename}`);

      setDownloaded(true);
    } catch (e) {
      console.error(e);
    }
  };

  const open = async () => {
    const name = new URL(url).pathname.split("/").pop();
    return new WebviewWindow("image-viewer", {
      url,
      title: name,
    });
  };

  const fallback = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/fallback-image.jpg";
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={open}
      className="group relative my-1 rounded-2xl border border-black/10 dark:border-white/10"
    >
      <img
        src={url}
        alt={url}
        loading="lazy"
        decoding="async"
        style={{ contentVisibility: "auto" }}
        onError={fallback}
        className="h-auto w-full rounded-2xl object-cover"
      />
      <button
        type="button"
        onClick={(e) => downloadImage(e)}
        className="absolute right-2 top-2 z-10 hidden size-10 items-center justify-center rounded-lg bg-white/10 text-black/70 backdrop-blur-2xl hover:bg-blue-500 hover:text-white group-hover:inline-flex"
      >
        {downloaded ? (
          <CheckCircleIcon className="size-5" />
        ) : (
          <DownloadIcon className="size-5" />
        )}
      </button>
    </div>
  );
}
