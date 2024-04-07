import { Col } from "@/components/col";
import { Toolbar } from "@/components/toolbar";
import { LoaderIcon } from "@lume/icons";
import { EventColumns, LumeColumn } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import { UnlistenFn } from "@tauri-apps/api/event";
import { resolveResource } from "@tauri-apps/api/path";
import { getCurrent } from "@tauri-apps/api/window";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { useEffect, useRef, useState } from "react";
import { VList, VListHandle } from "virtua";

export const Route = createFileRoute("/$account/home")({
  component: Screen,
  pendingComponent: Pending,
  beforeLoad: async ({ context }) => {
    const ark = context.ark;
    const resourcePath = await resolveResource("resources/system_columns.json");
    const systemColumns: LumeColumn[] = JSON.parse(
      await readTextFile(resourcePath),
    );
    const userColumns = await ark.get_columns();

    return {
      storedColumns: !userColumns.length ? systemColumns : userColumns,
    };
  },
});

function Screen() {
  const { account } = Route.useParams();
  const { ark, storedColumns } = Route.useRouteContext();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isScroll, setIsScroll] = useState(false);
  const [columns, setColumns] = useState(storedColumns);

  const vlistRef = useRef<VListHandle>(null);

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
    const existed = columns.find((item) => item.label === column.label);
    if (!existed) {
      const lastColIndex = columns.findIndex((item) => item.label === "open");
      const newColumns = [
        ...columns.slice(0, lastColIndex),
        column,
        ...columns.slice(lastColIndex),
      ];

      // update state
      setColumns(newColumns);
      setSelectedIndex(newColumns.length - 1);

      // save state
      ark.set_columns(newColumns);
    }

    // scroll to new column
    vlistRef.current.scrollToIndex(columns.length - 1, {
      align: "center",
    });
  };

  const remove = (label: string) => {
    const newColumns = columns.filter((t) => t.label !== label);

    // update state
    setColumns(newColumns);
    setSelectedIndex(newColumns.length - 1);
    vlistRef.current.scrollToIndex(newColumns.length - 1, {
      align: "center",
    });

    // save state
    ark.set_columns(newColumns);
  };

  useEffect(() => {
    let unlisten: UnlistenFn = undefined;

    const listenColumnEvent = async () => {
      const mainWindow = getCurrent();
      if (!unlisten) {
        unlisten = await mainWindow.listen<EventColumns>("columns", (data) => {
          if (data.payload.type === "add") add(data.payload.column);
          if (data.payload.type === "remove") remove(data.payload.label);
        });
      }
    };

    // listen for column changes
    listenColumnEvent();

    // clean up
    return () => {
      if (unlisten) {
        unlisten();
        unlisten = undefined;
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
            key={column.label}
            column={column}
            account={account}
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
