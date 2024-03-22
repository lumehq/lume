import { Col } from "@/components/col";
import { Toolbar } from "@/components/toolbar";
import { LoaderIcon } from "@lume/icons";
import { EventColumns, LumeColumn } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import { UnlistenFn } from "@tauri-apps/api/event";
import { getCurrent } from "@tauri-apps/api/window";
import { useEffect, useRef, useState } from "react";
import { VList, VListHandle } from "virtua";
import { useHotkeys } from "react-hotkeys-hook";

export const Route = createFileRoute("/$account/home")({
  component: Screen,
  pendingComponent: Pending,
});

const DEFAULT_COLUMNS: LumeColumn[] = [
  { id: 10001, name: "Newsfeed", content: "/newsfeed" },
  { id: 10000, name: "Open Lume Store", content: "/open" },
];

function Screen() {
  const search = Route.useSearch();
  const vlistRef = useRef<VListHandle>(null);

  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isScroll, setIsScroll] = useState(false);

  useHotkeys("left", () => goLeft());
  useHotkeys("right", () => goRight());

  const goLeft = () => {
    const prevIndex = Math.max(selectedIndex - 1, 0);
    setSelectedIndex(prevIndex);
    vlistRef.current.scrollToIndex(prevIndex, {
      align: "center",
    });
  };

  const goRight = () => {
    const nextIndex = Math.min(selectedIndex + 1, columns.length - 1);
    setSelectedIndex(nextIndex);
    vlistRef.current.scrollToIndex(nextIndex, {
      align: "center",
    });
  };

  const add = (column: LumeColumn) => {
    const existed = columns.find((item) => item.id === column.id);
    if (!existed) {
      let lastColIndex: number;
      const openColIndex = columns.findIndex((item) => item.id === 10000);
      const storeColIndex = columns.findIndex((item) => item.id === 9999);

      if (storeColIndex) {
        lastColIndex = storeColIndex;
      } else {
        lastColIndex = openColIndex;
      }

      const newColumns = [
        ...columns.slice(0, lastColIndex),
        column,
        ...columns.slice(lastColIndex),
      ];

      // update state & scroll to new column
      setColumns(newColumns);
      setSelectedIndex(newColumns.length - 1);
      vlistRef.current.scrollToIndex(newColumns.length - 1, {
        align: "center",
      });
    }
  };

  const remove = (id: number) => {
    setColumns((prev) => prev.filter((t) => t.id !== id));
    setSelectedIndex(columns.length);
    vlistRef.current.scrollToIndex(columns.length, {
      align: "center",
    });
  };

  useEffect(() => {
    let unlisten: UnlistenFn = undefined;

    const listenColumnEvent = async () => {
      const mainWindow = getCurrent();
      if (!unlisten) {
        unlisten = await mainWindow.listen<EventColumns>("columns", (data) => {
          if (data.payload.type === "add") add(data.payload.column);
          if (data.payload.type === "remove") remove(data.payload.id);
        });
      }
    };

    // listen for column changes
    listenColumnEvent();

    // clean up
    return () => {
      if (unlisten) {
        unlisten();
        unlisten = null;
      }
    };
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
        {columns.map((column) => (
          <Col
            key={column.id}
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
