import { LumeColumn } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrent } from "@tauri-apps/api/window";

export const Route = createFileRoute("/store/official")({
  component: Screen,
  loader: () => {
    const columns: LumeColumn[] = [
      {
        id: 10002,
        name: "For you",
        content: "/foryou",
        logo: "",
        cover: "/foryou.png",
        coverRetina: "/foryou@2x.png",
        author: "Lume",
        description: "Keep up to date with content based on your interests.",
      },
      {
        id: 10003,
        name: "Group Feeds",
        content: "/group",
        logo: "",
        cover: "/group.png",
        coverRetina: "/group@2x.png",
        author: "Lume",
        description: "Collective of people you're interested in.",
      },
      {
        id: 10004,
        name: "Antenas",
        content: "/antenas",
        logo: "",
        cover: "/antenas.png",
        coverRetina: "/antenas@2x.png",
        author: "Lume",
        description: "Keep track to specific content.",
      },
      {
        id: 10005,
        name: "Trending",
        content: "/trending",
        logo: "",
        cover: "/trending.png",
        coverRetina: "/trending@2x.png",
        author: "Lume",
        description: "What is trending on Nostr?.",
      },
      {
        id: 10006,
        name: "Global",
        content: "/global",
        logo: "",
        cover: "/global.png",
        coverRetina: "/global@2x.png",
        author: "Lume",
        description: "All events from connected relays.",
      },
    ];
    return columns;
  },
});

function Screen() {
  const data = Route.useLoaderData();

  const install = async (column: LumeColumn) => {
    const mainWindow = getCurrent();
    await mainWindow.emit("columns", { type: "add", column });
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      {data.map((column) => (
        <div
          key={column.id}
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
