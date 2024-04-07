import { LumeColumn } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import { resolveResource } from "@tauri-apps/api/path";
import { getCurrent } from "@tauri-apps/api/window";
import { readTextFile } from "@tauri-apps/plugin-fs";

export const Route = createFileRoute("/store/official")({
  component: Screen,
  beforeLoad: async () => {
    const resourcePath = await resolveResource(
      "resources/official_columns.json",
    );
    const officialColumns: LumeColumn[] = JSON.parse(
      await readTextFile(resourcePath),
    );

    return {
      officialColumns,
    };
  },
});

function Screen() {
  const { officialColumns } = Route.useRouteContext();

  const install = async (column: LumeColumn) => {
    const mainWindow = getCurrent();
    await mainWindow.emit("columns", { type: "add", column });
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      {officialColumns.map((column) => (
        <div
          key={column.label}
          className="relative h-[200px] w-full overflow-hidden rounded-xl bg-gradient-to-tr from-orange-100 to-blue-200 px-3 pt-3"
        >
          {column.cover ? (
            <img
              src={column.cover}
              srcSet={column.coverRetina}
              alt={column.name}
              loading="lazy"
              decoding="async"
              className="absolute left-0 top-0 z-10 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute bottom-0 left-0 z-20 h-16 w-full bg-black/40 px-3 backdrop-blur-xl">
            <div className="flex h-full items-center justify-between">
              <div>
                <h1 className="font-semibold text-white">{column.name}</h1>
                <p className="max-w-[24rem] truncate text-sm text-white/80">
                  {column.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => install(column)}
                className="inline-flex h-8 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-medium text-white hover:bg-white hover:text-blue-500"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
