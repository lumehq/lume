import { AddMediaIcon, LoaderIcon } from "@lume/icons";
import { cn, insertImage, isImagePath } from "@lume/utils";
import { useEffect, useState } from "react";
import { useSlateStatic } from "slate-react";
import { toast } from "sonner";
import { getCurrent } from "@tauri-apps/api/window";
import { UnlistenFn } from "@tauri-apps/api/event";
import { useRouteContext } from "@tanstack/react-router";

export function MediaButton({ className }: { className?: string }) {
  const { ark } = useRouteContext({ strict: false });
  const editor = useSlateStatic();

  const [loading, setLoading] = useState(false);

  const uploadToNostrBuild = async () => {
    try {
      setLoading(true);

      const image = await ark.upload();

      if (image) {
        insertImage(editor, image);
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error(`Upload failed, error: ${e}`);
    }
  };

  useEffect(() => {
    let unlisten: UnlistenFn = undefined;

    async function listenFileDrop() {
      const window = getCurrent();
      if (!unlisten) {
        unlisten = await window.listen("tauri://file-drop", async (event) => {
          // @ts-ignore, lfg !!!
          const items: string[] = event.payload.paths;
          // start loading
          setLoading(true);
          // upload all images
          for (const item of items) {
            if (isImagePath(item)) {
              const image = await ark.upload(item);
              insertImage(editor, image);
            }
          }
          // stop loading
          setLoading(false);
        });
      }
    }

    listenFileDrop();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => uploadToNostrBuild()}
      disabled={loading}
      className={cn("inline-flex items-center justify-center", className)}
    >
      {loading ? (
        <LoaderIcon className="size-5 animate-spin" />
      ) : (
        <AddMediaIcon className="size-5" />
      )}
    </button>
  );
}
