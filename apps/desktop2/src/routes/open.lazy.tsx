import { PlusIcon } from "@lume/icons";
import { LumeColumn } from "@lume/types";
import { Column } from "@lume/ui";
import { createLazyRoute } from "@tanstack/react-router";
import { getCurrent } from "@tauri-apps/api/window";

export const Route = createLazyRoute("/open")({
  component: Screen,
});

function Screen() {
  const install = async (column: LumeColumn) => {
    const mainWindow = getCurrent();
    await mainWindow.emit("columns", { type: "add", column });
  };

  return (
    <Column.Root shadow={false} background={false}>
      <Column.Content className="flex h-full w-full items-center justify-center">
        <button
          type="button"
          onClick={() =>
            install({
              id: 9999,
              name: "Lume Store",
              content: "/store/official",
            })
          }
          className="inline-flex size-14 items-center justify-center rounded-full bg-black/10 backdrop-blur-lg hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <PlusIcon className="size-8" />
        </button>
      </Column.Content>
    </Column.Root>
  );
}
