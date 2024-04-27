import { useEffect, useRef, useState } from "react";
import type { LumeColumn } from "@lume/types";
import { invoke } from "@tauri-apps/api/core";
import { cn } from "@lume/utils";
import { getCurrent } from "@tauri-apps/api/webviewWindow";
import { CancelIcon, CheckIcon, RefreshIcon } from "@lume/icons";
import { Webview } from "@tauri-apps/api/webview";

export function Col({
  column,
  account,
  isScroll,
  isResize,
}: {
  column: LumeColumn;
  account: string;
  isScroll: boolean;
  isResize: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [webview, setWebview] = useState<string | undefined>(undefined);

  const repositionWebview = async () => {
    if (webview && webview.length > 1) {
      const newRect = container.current.getBoundingClientRect();
      await invoke("reposition_column", {
        label: webview,
        x: newRect.x,
        y: newRect.y,
      });
    }
  };

  const resizeWebview = async () => {
    if (webview && webview.length > 1) {
      const newRect = container.current.getBoundingClientRect();
      await invoke("resize_column", {
        label: webview,
        width: newRect.width,
        height: newRect.height,
      });
    }
  };

  useEffect(() => {
    resizeWebview();
  }, [isResize]);

  useEffect(() => {
    if (isScroll) repositionWebview();
  }, [isScroll]);

  useEffect(() => {
    (async () => {
      if (webview && webview.length > 1) return;

      const rect = container.current.getBoundingClientRect();
      const windowLabel = `column-${column.label}`;
      const url = `${column.content}?account=${account}&label=${column.label}&name=${column.name}`;

      // create new webview
      const label: string = await invoke("create_column", {
        label: windowLabel,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        url,
      });

      setWebview(label);
    })();

    // close webview when unmounted
    return () => {
      if (webview && webview.length > 1) {
        invoke("close_column", {
          label: webview,
        });
      }
    };
  }, [webview]);

  return (
    <div className="h-full w-[440px] shrink-0 p-2">
      <div
        className={cn(
          "flex flex-col w-full h-full rounded-xl",
          column.label !== "open"
            ? "bg-black/5 dark:bg-white/5 backdrop-blur-sm"
            : "",
        )}
      >
        {column.label !== "open" ? (
          <Header label={column.label} name={column.name} />
        ) : null}
        <div ref={container} className="flex-1 w-full h-full" />
      </div>
    </div>
  );
}

function Header({ label, name }: { label: string; name: string }) {
  const [title, setTitle] = useState(name);
  const [isChanged, setIsChanged] = useState(false);

  const saveNewTitle = async () => {
    const mainWindow = getCurrent();
    await mainWindow.emit("columns", { type: "set_title", label, title });

    // update search params
    // @ts-ignore, hahaha
    search.name = title;

    // reset state
    setIsChanged(false);
  };

  const close = async () => {
    const mainWindow = getCurrent();
    await mainWindow.emit("columns", { type: "remove", label });
  };

  useEffect(() => {
    if (title.length !== name.length) setIsChanged(true);
  }, [title]);

  return (
    <div className="h-9 w-full flex items-center justify-between shrink-0 px-1">
      <div className="size-7" />
      <div className="shrink-0 h-9 flex items-center justify-center">
        <div className="relative flex gap-2 items-center">
          <div
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={(e) => setTitle(e.currentTarget.textContent)}
            className="text-sm font-medium focus:outline-none"
          >
            {name}
          </div>
          {isChanged ? (
            <button
              type="button"
              onClick={saveNewTitle}
              className="text-teal-500 hover:text-teal-600"
            >
              <CheckIcon className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={close}
        className="size-7 inline-flex hover:bg-black/10 rounded-lg dark:hover:bg-white/10 items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
      >
        <CancelIcon className="size-4" />
      </button>
    </div>
  );
}
