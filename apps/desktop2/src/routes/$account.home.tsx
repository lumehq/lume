import { Col } from "@/components/col";
import { Toolbar } from "@/components/toolbar";
import { LoaderIcon } from "@lume/icons";
import { EventColumns, LumeColumn } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import { UnlistenFn } from "@tauri-apps/api/event";
import { getCurrent } from "@tauri-apps/api/window";
import { useEffect, useRef, useState } from "react";
import { VList, VListHandle } from "virtua";

export const Route = createFileRoute("/$account/home")({
  component: Screen,
  pendingComponent: Pending,
});

const COLS: LumeColumn[] = [
  { id: 1, name: "Newsfeed", content: "/newsfeed" },
  { id: 9999, name: "Lume Store", content: "/store/official" },
];

function Screen() {
  const search = Route.useSearch();
  const vlistRef = useRef<VListHandle>(null);
  const unlisten = useRef<UnlistenFn>(null);

  const [columns, setColumns] = useState(COLS);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isScroll, setIsScroll] = useState(false);

  const goLeft = () => {
    const prevIndex = Math.max(selectedIndex - 1, 0);
    setSelectedIndex(prevIndex);
    vlistRef.current.scrollToIndex(prevIndex, {
      align: "start",
    });
  };

  const goRight = () => {
    const nextIndex = Math.min(selectedIndex + 1, columns.length - 1);
    setSelectedIndex(nextIndex);
    vlistRef.current.scrollToIndex(nextIndex, {
      align: "end",
    });
  };

  const add = (column: LumeColumn) => {
    const col = columns.find((item) => item.id === column.id);
    if (!col) {
      setColumns((prev) => [...prev, column]);
    }
  };

  const remove = (id: number) => {
    setColumns((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const listenColumnEvent = async () => {
      const mainWindow = getCurrent();
      if (!unlisten) {
        unlisten.current = await mainWindow.listen<EventColumns>(
          "columns",
          (data) => {
            if (data.payload.type === "add") add(data.payload.column);
            if (data.payload.type === "remove") remove(data.payload.id);
          },
        );
      }
    };

    // listen for column changes
    listenColumnEvent();

    // clean up
    return () => unlisten.current?.();
  }, []);

  return (
    <div className="h-full w-full">
      <VList
        ref={vlistRef}
        horizontal
        itemSize={440}
        tabIndex={0}
        onKeyDown={(e) => {
          if (!vlistRef.current) return;
          switch (e.code) {
            case "ArrowUp":
            case "ArrowLeft": {
              e.preventDefault();
              goLeft();
              break;
            }
            case "ArrowDown":
            case "ArrowRight": {
              e.preventDefault();
              goRight();
              break;
            }
          }
        }}
        onScroll={() => {
          setIsScroll(true);
        }}
        onScrollEnd={() => {
          setIsScroll(false);
        }}
        className="scrollbar-none h-full w-full overflow-x-auto focus:outline-none"
      >
        {columns.map((column, index) => (
          <Col
            key={column.id + index}
            column={column}
            // @ts-ignore, yolo !!!
            account={search.acccount}
            isScroll={isScroll}
          />
        ))}
      </VList>
      <Toolbar moveLeft={goLeft} moveRight={goRight} />
    </div>
  );
}

function Pending() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <button type="button" disabled>
        <LoaderIcon className="size-5 animate-spin" />
      </button>
    </div>
  );
}
