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
      <Column.Content className="relative flex h-full w-full items-center justify-center">
        <div className="group absolute left-0 top-0 z-10 h-full w-12">
          <button
            type="button"
            onClick={() =>
              install({
                id: 9999,
                name: "Lume Store",
                content: "/store/official",
              })
            }
            className="flex h-full w-full items-center justify-center rounded-xl bg-transparent transition-colors duration-100 ease-in-out group-hover:bg-black/5 dark:group-hover:bg-white/5"
          >
            <PlusIcon className="size-6 scale-0 transform transition-transform duration-150 ease-in-out will-change-transform group-hover:scale-100" />
          </button>
        </div>
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
