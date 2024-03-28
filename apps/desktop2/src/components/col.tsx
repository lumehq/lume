import { useEffect, useMemo, useRef } from "react";
import { getCurrent } from "@tauri-apps/api/window";
import { LumeColumn } from "@lume/types";
import { invoke } from "@tauri-apps/api/core";

export function Col({
  column,
  account,
  isScroll,
}: {
  column: LumeColumn;
  account: string;
  isScroll: boolean;
}) {
  const window = useMemo(() => getCurrent(), []);
  const webview = useRef<string>(null);
  const container = useRef<HTMLDivElement>(null);

  const createWebview = async () => {
    const rect = container.current.getBoundingClientRect();
    const label = `column-${column.id}`;
    const url =
      column.content +
      `?account=${account}&id=${column.id}&name=${column.name}`;

    // create new webview
    webview.current = await invoke("create_column", {
      label,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      url,
    });
  };

  const closeWebview = async () => {
    const close = await invoke("close_column", {
      label: webview.current,
    });
    if (close) webview.current = null;
  };

  const repositionWebview = async () => {
    if (!webview.current) return;
    const newRect = container.current.getBoundingClientRect();
    await invoke("reposition_column", {
      label: webview.current,
      x: newRect.x,
      y: newRect.y,
    });
  };

  useEffect(() => {
    if (isScroll) {
      repositionWebview();
    }
  }, [isScroll]);

  useEffect(() => {
    if (!window) return;
    if (!container.current) return;
    if (webview.current) return;

    // create webview for current column
    createWebview();

    // close webview when unmounted
    return () => {
      if (webview.current) closeWebview();
    };
  }, []);

  return <div ref={container} className="h-full w-[440px] shrink-0 p-2" />;
}
