import { Spinner } from "@lume/ui";
import { User } from "@/components/user";
import { Await, defer } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/trending/users")({
  loader: async ({ abortController }) => {
    try {
      return {
        data: defer(
          fetch("https://api.nostr.band/v0/trending/profiles", {
            signal: abortController.signal,
          }).then((res) => res.json()),
        ),
      };
    } catch (e) {
      throw new Error(String(e));
    }
  },
  component: Screen,
});

export function Screen() {
  const { data } = Route.useLoaderData();

  return (
    <div className="w-full h-full">
      <Suspense
        fallback={
          <div className="flex h-20 w-full flex-col items-center justify-center gap-1">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium"
              disabled
            >
              <Spinner className="size-5" />
              Loading...
            </button>
          </div>
        }
      >
        <Await promise={data}>
          {(users) =>
            users.profiles.map((item: { pubkey: string }) => (
              <div
                key={item.pubkey}
                className="h-max w-full overflow-hidden mb-3 p-2 bg-black/5 dark:bg-white/5 backdrop-blur-lg rounded-xl"
              >
                <User.Provider pubkey={item.pubkey}>
                  <User.Root>
                    <div className="flex h-full w-full flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <User.Avatar className="size-10 shrink-0 rounded-full object-cover" />
                          <User.Name className="leadning-tight max-w-[15rem] truncate font-semibold" />
                        </div>
                        <User.Button className="inline-flex h-8 w-20 items-center justify-center rounded-lg bg-black/10 text-sm font-medium hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20" />
                      </div>
                      <User.About className="mt-1 line-clamp-3 max-w-none select-text text-neutral-800 dark:text-neutral-400" />
                    </div>
                  </User.Root>
                </User.Provider>
              </div>
            ))
          }
        </Await>
      </Suspense>
    </div>
  );
}
