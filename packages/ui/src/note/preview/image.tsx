import { CheckCircleIcon, DownloadIcon } from "@lume/icons";
import { downloadDir } from "@tauri-apps/api/path";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { download } from "@tauri-apps/plugin-upload";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function ImagePreview({ url }: { url: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  const downloadImage = async (e: { stopPropagation: () => void }) => {
    try {
      e.stopPropagation();

      const downloadDirPath = await downloadDir();
      const filename = url.substring(url.lastIndexOf("/") + 1);
      await download(url, `${downloadDirPath}/${filename}`);

      setDownloaded(true);
    } catch (e) {
      toast.error(String(e));
    }
  };

  const open = async () => {
    const label = new URL(url).pathname
      .split("/")
      .pop()
      .replace(/[^a-zA-Z ]/g, "");
    const window = new WebviewWindow(`viewer-${label}`, {
      url,
      title: "Image Viewer",
      width: imgRef?.current.width || 600,
      height: imgRef?.current.height || 600,
      titleBarStyle: "overlay",
    });

    return window;
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={open}
      className="group relative my-1 overflow-hidden rounded-xl ring-1 ring-neutral-100 dark:ring-neutral-900"
    >
      <img
        src={url}
        alt={url}
        ref={imgRef}
        loading="lazy"
        decoding="async"
        style={{ contentVisibility: "auto" }}
        className="h-auto w-full object-cover"
      />
      <button
        type="button"
        onClick={(e) => downloadImage(e)}
        className="absolute right-2 top-2 z-20 hidden size-8 items-center justify-center rounded-md bg-black/10 text-white/70 backdrop-blur-2xl hover:bg-blue-500 hover:text-white group-hover:inline-flex"
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
