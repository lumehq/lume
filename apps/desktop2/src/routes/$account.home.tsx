import { Col } from "@/components/col";
import { Toolbar } from "@/components/toolbar";
import { ArrowLeftIcon, ArrowRightIcon } from "@lume/icons";
import type { EventColumns, LumeColumn } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import { listen } from "@tauri-apps/api/event";
import { resolveResource } from "@tauri-apps/api/path";
import { getCurrent } from "@tauri-apps/api/window";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { VList, type VListHandle } from "virtua";

export const Route = createFileRoute("/$account/home")({
  beforeLoad: async ({ context }) => {
    try {
      const ark = context.ark;
      const resourcePath = await resolveResource(
        "resources/system_columns.json",
      );
      const systemColumns: LumeColumn[] = JSON.parse(
        await readTextFile(resourcePath),
      );
      const userColumns = await ark.get_columns();

      return {
        storedColumns: !userColumns.length ? systemColumns : userColumns,
      };
    } catch (e) {
      console.error(String(e));
    }
  },
  component: Screen,
});

function Screen() {
  const vlistRef = useRef<VListHandle>(null);

  const { account } = Route.useParams();
  const { ark, storedColumns } = Route.useRouteContext();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [columns, setColumns] = useState(storedColumns);
  const [isScroll, setIsScroll] = useState(false);
  const [isResize, setIsResize] = useState(false);

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
    // update col label
    column.label = `${column.label}-${nanoid()}`;

    // create new cols
    const cols = [...columns];
    const openColIndex = cols.findIndex((col) => col.label === "open");
    const newCols = [
      ...cols.slice(0, openColIndex),
      column,
      ...cols.slice(openColIndex),
    ];

    setColumns(newCols);
    setSelectedIndex(newCols.length);
    setIsScroll(true);

    // scroll to the newest column
    vlistRef.current.scrollToIndex(newCols.length - 1, {
      align: "end",
    });
  }, 150);

  const remove = useDebouncedCallback((label: string) => {
    const newCols = columns.filter((t) => t.label !== label);

    setColumns(newCols);
    setSelectedIndex(newCols.length);
    setIsScroll(true);

    // scroll to the first column
    vlistRef.current.scrollToIndex(newCols.length - 1, {
      align: "start",
    });
  }, 150);

  const updateName = useDebouncedCallback((label: string, title: string) => {
    const currentColIndex = columns.findIndex((col) => col.label === label);

    const updatedCol = Object.assign({}, columns[currentColIndex]);
    updatedCol.name = title;

    const newCols = columns.slice();
    newCols[currentColIndex] = updatedCol;

    setColumns(newCols);
  }, 150);

  const startResize = useDebouncedCallback(
    () => setIsResize((prev) => !prev),
    150,
  );

  useEffect(() => {
    // save state
    ark.set_columns(columns);
  }, [columns]);

  useEffect(() => {
    let unlistenColEvent: Awaited<ReturnType<typeof listen>> | undefined =
      undefined;
    let unlistenWindowResize: Awaited<ReturnType<typeof listen>> | undefined =
      undefined;

    (async () => {
      if (unlistenColEvent && unlistenWindowResize) return;

      unlistenColEvent = await listen<EventColumns>("columns", (data) => {
        if (data.payload.type === "add") add(data.payload.column);
        if (data.payload.type === "remove") remove(data.payload.label);
        if (data.payload.type === "set_title")
          updateName(data.payload.label, data.payload.title);
      });

      unlistenWindowResize = await getCurrent().listen("tauri://resize", () => {
        startResize();
      });
    })();

    return () => {
      if (unlistenColEvent) unlistenColEvent();
      if (unlistenWindowResize) unlistenWindowResize();
    };
  }, []);

  return (
    <div className="h-full w-full">
      <VList
        ref={vlistRef}
        horizontal
        tabIndex={-1}
        itemSize={440}
        overscan={3}
        onScroll={() => setIsScroll(true)}
        onScrollEnd={() => setIsScroll(false)}
        className="scrollbar-none h-full w-full overflow-x-auto focus:outline-none"
      >
        {columns.map((column) => (
          <Col
            key={column.label}
            column={column}
            account={account}
            isScroll={isScroll}
            isResize={isResize}
          />
        ))}
      </VList>
      <Toolbar>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goLeft()}
            className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-black/10 dark:text-neutral-200 dark:hover:bg-white/10"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goRight()}
            className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-black/10 dark:text-neutral-200 dark:hover:bg-white/10"
          >
            <ArrowRightIcon className="size-5" />
          </button>
        </div>
      </Toolbar>
    </div>
  );
}
