import { Col } from "@/components/col";
import { Toolbar } from "@/components/toolbar";
import { LoaderIcon } from "@lume/icons";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { VList, VListHandle } from "virtua";

export const Route = createFileRoute("/$account/home")({
  component: Screen,
  pendingComponent: Pending,
  loader: async () => {
    const columns = [
      { name: "Newsfeed", content: "/columns/newsfeed" },
      { name: "Default", content: "/columns/default" },
    ];
    return columns;
  },
});

function Screen() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  const vlistRef = useRef<VListHandle>(null);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isScroll, setIsScroll] = useState(false);

  const moveLeft = () => {
    const prevIndex = Math.max(selectedIndex - 1, 0);
    setSelectedIndex(prevIndex);
    vlistRef.current.scrollToIndex(prevIndex, {
      align: "start",
    });
  };

  const moveRight = () => {
    const nextIndex = Math.min(selectedIndex + 1, data.length - 1);
    setSelectedIndex(nextIndex);
    vlistRef.current.scrollToIndex(nextIndex, {
      align: "end",
    });
  };

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
              moveLeft();
              break;
            }
            case "ArrowDown":
            case "ArrowRight": {
              e.preventDefault();
              moveRight();
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
        {data.map((column, index) => (
          <Col
            key={column.name + index}
            column={column}
            // @ts-ignore, yolo !!!
            account={search.acccount}
            isScroll={isScroll}
          />
        ))}
      </VList>
      <Toolbar moveLeft={moveLeft} moveRight={moveRight} />
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
