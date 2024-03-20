import { useEffect, useMemo, useRef, useState } from "react";
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
  const container = useRef<HTMLDivElement>(null);

  const [webview, setWebview] = useState<string>(null);

  const createWebview = async () => {
    const rect = container.current.getBoundingClientRect();
    const name = `column-${column.name.toLowerCase().replace(/\W/g, "")}`;
    const url = column.content + `?account=${account}&name=${column.name}`;

    // create new webview
    const label: string = await invoke("create_column", {
      label: name,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      url,
    });

    setWebview(label);
  };

  const closeWebview = async () => {
    if (!webview) return;
    await invoke("close_column", {
      label: webview,
    });
  };

  const repositionWebview = async () => {
    const newRect = container.current.getBoundingClientRect();
    await invoke("reposition_column", {
      label: webview,
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

    // create webview for current column
    createWebview();

    // close webview when unmounted
    return () => {
      closeWebview();
    };
  }, []);

  return <div ref={container} className="h-full w-[440px] shrink-0 p-2" />;
}
