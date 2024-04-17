import { CheckCircleIcon, DownloadIcon } from "@lume/icons";
import { downloadDir } from "@tauri-apps/api/path";
import { Window } from "@tauri-apps/api/window";
import { download } from "@tauri-apps/plugin-upload";
import { SyntheticEvent, useState } from "react";
import { useNoteContext } from "../provider";

export function ImagePreview({ url }: { url: string }) {
  const event = useNoteContext();
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
    return new Window(`image-viewer-${event.id}`, {
      url,
      title: "Image Viewer",
    });
  };

  const fallback = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/fallback-image.jpg";
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div onClick={open} className="relative mt-1 mb-2.5 group">
      <img
        src={url}
        alt={url}
        loading="lazy"
        decoding="async"
        style={{ contentVisibility: "auto" }}
        onError={fallback}
        className="object-cover w-full h-auto border rounded-xl border-neutral-200/50 dark:border-neutral-800/50"
      />
      <button
        type="button"
        onClick={(e) => downloadImage(e)}
        className="absolute z-10 items-center justify-center hidden size-10 bg-white/10 text-black/70 backdrop-blur-xl rounded-lg right-2 top-2 group-hover:inline-flex hover:bg-blue-500 hover:text-white"
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
