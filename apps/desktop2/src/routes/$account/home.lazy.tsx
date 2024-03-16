import { LumeColumn } from "@lume/types";
import { Column } from "@lume/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const DEFAULT_COLUMNS: LumeColumn[] = [
  { name: "Tauri v2", content: "https://beta.tauri.app" },
  { name: "Tauri v1", content: "https://tauri.app" },
  { name: "Lume", content: "https://lume.nu" },
  { name: "Snort", content: "https://snort.social" },
];

export const Route = createLazyFileRoute("/$account/home")({
  component: Screen,
});

function Screen() {
  const [isScroll, setIsScroll] = useState(false);

  return (
    <div className="relative h-full w-full">
      <div
        onScroll={() => setIsScroll((state) => !state)}
        className="flex h-full w-full flex-nowrap gap-3 overflow-x-auto px-3 pb-3 pt-1.5 focus:outline-none"
      >
        {DEFAULT_COLUMNS.map((column, index) => (
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
