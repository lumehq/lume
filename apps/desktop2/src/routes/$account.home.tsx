import { Col } from "@/components/col";
import { Toolbar } from "@/components/toolbar";
import { LoaderIcon } from "@lume/icons";
import { EventColumns, LumeColumn } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import { listen } from "@tauri-apps/api/event";
import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
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

  const add = useDebouncedCallback((column: LumeColumn) => {
    column["label"] = column.label + "-" + nanoid();

    setColumns((state) => [...state, column]);
    setSelectedIndex(columns.length + 1);

    // scroll to the last column
    vlistRef.current.scrollToIndex(columns.length + 1, {
      align: "end",
    });
  }, 150);

  const remove = useDebouncedCallback((label: string) => {
    setColumns((state) => state.filter((t) => t.label !== label));
    setSelectedIndex(columns.length - 1);

    // scroll to the first column
    vlistRef.current.scrollToIndex(0, {
      align: "start",
    });
  }, 150);

  useEffect(() => {
    ark.set_columns(columns);
  }, [columns]);

  useEffect(() => {
    let unlisten: Awaited<ReturnType<typeof listen>> | undefined = undefined;

    (async () => {
      if (unlisten) return;
      unlisten = await listen<EventColumns>("columns", (data) => {
        if (data.payload.type === "add") add(data.payload.column);
        if (data.payload.type === "remove") remove(data.payload.label);
      });
    })();

    return () => {
      if (unlisten) unlisten();
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
        {columns.map((column, index) => (
          <Col
            key={column.label + index}
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
      <button type="button" className="size-5" disabled>
        <LoaderIcon className="size-5 animate-spin" />
      </button>
    </div>
  );
}
