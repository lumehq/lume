import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/store/official")({
  component: Screen,
});

function Screen() {
  /*
  const add = async (column: LumeColumn) => {
    const mainWindow = getCurrent();
    await mainWindow.emit("columns", { type: "add", column });
  };
  */

  return (
    <div className="flex flex-col gap-3 px-3 pt-3">
      <div className="relative h-[200px] w-full overflow-hidden rounded-xl bg-gradient-to-tr from-orange-100 to-blue-200 px-3 pt-3">
        <div className="absolute bottom-0 left-0 h-16 w-full bg-black/40 px-3 backdrop-blur-xl">
          <div className="flex h-full items-center justify-between">
            <div>
              <h1 className="font-semibold text-white">Group Feeds</h1>
              <p className="max-w-[18rem] truncate text-sm text-white/80">
                Collective of people you're interested in.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-medium text-white hover:bg-white hover:text-blue-500"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="relative h-[200px] w-full overflow-hidden rounded-xl bg-gradient-to-tr from-fuchsia-100 to-red-100 px-3 pt-3">
        <div className="absolute bottom-0 left-0 h-16 w-full bg-black/40 px-3 backdrop-blur-xl">
          <div className="flex h-full items-center justify-between">
            <div>
              <h1 className="font-semibold text-white">Antenas</h1>
              <p className="max-w-[18rem] truncate text-sm text-white/80">
                Keep track to specific content.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-medium text-white hover:bg-white hover:text-blue-500"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
