import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  LogicalPosition,
  LogicalSize,
  getCurrent,
} from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";
import { LumeColumn } from "@lume/types";
import { useDebouncedCallback } from "use-debounce";
import { type UnlistenFn } from "@tauri-apps/api/event";

export function Col({
  column,
  account,
  isScroll,
}: {
  column: LumeColumn;
  account: string;
  isScroll: boolean;
}) {
  const mainWindow = useMemo(() => getCurrent(), []);
  const childWindow = useRef<Webview>(null);
  const container = useRef<HTMLDivElement>(null);
  const initialRect = useRef<DOMRect>(null);
  const unlisten = useRef<UnlistenFn>(null);
  const handleResize = useDebouncedCallback(() => {
    if (!childWindow.current) return;
    const newRect = container.current.getBoundingClientRect();
    if (initialRect.current.height !== newRect.height) {
      childWindow.current.setSize(
        new LogicalSize(newRect.width, newRect.height),
      );
    }
  }, 500);

  const trackResize = useCallback(async () => {
    unlisten.current = await mainWindow.onResized(() => {
      handleResize();
    });
  }, []);

  useEffect(() => {
    if (!childWindow.current) return;
    if (isScroll) {
      const newRect = container.current.getBoundingClientRect();
      childWindow.current.setPosition(
        new LogicalPosition(newRect.x, newRect.y),
      );
    }
  }, [isScroll]);

  useEffect(() => {
    if (!mainWindow) return;
    if (!container.current) return;
    if (childWindow.current) return;

    const rect = container.current.getBoundingClientRect();
    const name = `column-${column.name.toLowerCase().replace(/\W/g, "")}`;
    const url = column.content + `?account=${account}&name=${column.name}`;

    // create new webview
    initialRect.current = rect;
    childWindow.current = new Webview(mainWindow, name, {
      url,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      transparent: true,
      userAgent: "Lume/4.0",
    });

    // track window resize event
    trackResize();

    return () => {
      if (unlisten.current) unlisten.current();
      if (childWindow.current) childWindow.current.close();
    };
  }, []);

  return <div ref={container} className="h-full w-[440px] shrink-0 p-2" />;
}
