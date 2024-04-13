import { Col } from "@/components/col";
import { Toolbar } from "@/components/toolbar";
import { ArrowLeftIcon, ArrowRightIcon } from "@lume/icons";
import { EventColumns, LumeColumn } from "@lume/types";
import { Spinner } from "@lume/ui";
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
    // save state
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
        tabIndex={-1}
        itemSize={440}
        overscan={3}
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
      <Toolbar>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goLeft()}
            className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goRight()}
            className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <ArrowRightIcon className="size-5" />
          </button>
        </div>
      </Toolbar>
    </div>
  );
}

function Pending() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <button type="button" className="size-5" disabled>
        <Spinner className="size-5" />
      </button>
    </div>
  );
}
