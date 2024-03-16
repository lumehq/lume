import { LoaderIcon } from "@lume/icons";
import { Column } from "@lume/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/$account/home")({
  component: Screen,
  pendingComponent: Pending,
  loader: async () => {
    const columns = [
      { name: "Tauri v2", content: "https://beta.tauri.app" },
      { name: "Tauri v1", content: "https://tauri.app" },
      { name: "Lume", content: "https://lume.nu" },
      { name: "Snort", content: "https://snort.social" },
    ];
    return columns;
  },
});

function Screen() {
  const data = Route.useLoaderData();
  const [isScroll, setIsScroll] = useState(false);

  return (
    <div className="relative h-full w-full">
      <div
        onScroll={() => setIsScroll((state) => !state)}
        className="flex h-full w-full flex-nowrap gap-3 overflow-x-auto px-3 pb-3 pt-1.5 focus:outline-none"
      >
        {data.map((column, index) => (
          <Column
            key={column.name + index}
            column={column}
            isScroll={isScroll}
          />
        ))}
      </div>
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
