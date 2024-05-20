import { ColumnRouteSearch } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
    return {
      account: search.account,
      label: search.label,
      name: search.name,
    };
  },
  component: Screen,
});

function Screen() {
  return (
    <div className="h-full flex flex-col py-6 gap-6 overflow-y-auto scrollbar-none">
      <div className="text-center flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif font-medium">Welcome to Lume</h1>
        <p className="leading-tight text-neutral-700 dark:text-neutral-300">
          Here are a few suggestions to help you get started.
        </p>
      </div>
      <div className="px-3 flex flex-col gap-3">
        <div className="relative flex flex-col items-center justify-center rounded-xl bg-black/10 dark:bg-white/10 backdrop-blur-lg">
          <div className="absolute top-2 left-3 text-2xl font-semibold font-serif text-neutral-600 dark:text-neutral-400">
            01.
          </div>
          <div className="h-16 flex items-center justify-center shrink-0 px-3 text-lg select-text">
            Navigate between columns.
          </div>
          <div className="flex-1 w-3/4 h-full pb-10">
            <video
              className="h-auto w-full aspect-square rounded-lg shadow-md transform"
              controls
              muted
            >
              <source
                src="https://video.nostr.build/692f71e2be47ecfc29edcbdaa198cc5979bfb9c900f05d78682895dd546d8d4f.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center rounded-xl bg-black/10 dark:bg-white/10 backdrop-blur-lg">
          <div className="absolute top-2 left-3 text-2xl font-semibold font-serif text-neutral-600 dark:text-neutral-400">
            02.
          </div>
          <div className="h-16 flex items-center justify-center shrink-0 px-3 text-lg select-text">
            Switch between accounts.
          </div>
          <div className="flex-1 w-3/4 h-full pb-10">
            <video
              className="h-auto w-full aspect-square rounded-lg shadow-md transform"
              controls
              muted
            >
              <source
                src="https://video.nostr.build/d33962520506d86acfb4b55a7b265821e10ae637f5ec830a173b7e6092b16ec8.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center rounded-xl bg-black/10 dark:bg-white/10 backdrop-blur-lg">
          <div className="absolute top-2 left-3 text-2xl font-semibold font-serif text-neutral-600 dark:text-neutral-400">
            03.
          </div>
          <div className="h-16 flex items-center justify-center shrink-0 px-3 text-lg select-text">
            Open Lume Store.
          </div>
          <div className="flex-1 w-3/4 h-full pb-10">
            <video
              className="h-auto w-full aspect-square rounded-lg shadow-md transform"
              controls
              muted
            >
              <source
                src="https://video.nostr.build/927abbfde2097e470ac751181b1db456b7e4b9149550408efff1a966a7ffb9a8.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center rounded-xl bg-black/10 dark:bg-white/10 backdrop-blur-lg">
          <div className="absolute top-2 left-3 text-2xl font-semibold font-serif text-neutral-600 dark:text-neutral-400">
            04.
          </div>
          <div className="h-16 flex items-center justify-center shrink-0 px-3 text-lg select-text">
            Use the Tray Menu.
          </div>
          <div className="flex-1 w-3/4 h-full pb-10">
            <video
              className="h-auto w-full rounded-lg shadow-md transform"
              controls
              muted
            >
              <source
                src="https://video.nostr.build/513de4824b6abaf7e9698c1dad2f68096574356848c0c200bc8cb8074df29410.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
