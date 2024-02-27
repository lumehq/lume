import { createLazyFileRoute } from "@tanstack/react-router";
import { WindowVirtualizer } from "virtua";
import { User } from "@lume/ui";
import { EventList } from "./-components/eventList";

export const Route = createLazyFileRoute("/users/$pubkey")({
  component: Screen,
});

function Screen() {
  const { pubkey } = Route.useParams();

  return (
    <WindowVirtualizer>
      <div className="flex h-screen w-screen flex-col bg-gradient-to-tr from-neutral-200 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <div data-tauri-drag-region className="h-11 w-full shrink-0" />
        <div className="flex h-full min-h-0 w-full">
          <div className="h-full w-full flex-1 px-2 pb-2">
            <div className="h-full w-full overflow-hidden overflow-y-auto rounded-xl bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-none dark:ring-1 dark:ring-white/5">
              <User.Provider pubkey={pubkey}>
                <User.Root>
                  <User.Cover className="h-44 w-full object-cover" />
                  <div className="relative -mt-8 flex flex-col gap-4 px-5">
                    <User.Avatar className="size-14 rounded-full" />
                    <div className="inline-flex items-start justify-between">
                      <div>
                        <User.Name className="font-semibold leading-tight" />
                        <User.NIP05 className="text-sm leading-tight text-neutral-600 dark:text-neutral-400" />
                      </div>
                      <User.Button className="h-9 w-24 rounded-full bg-black text-sm font-medium text-white hover:bg-neutral-900 dark:bg-neutral-900" />
                    </div>
                    <User.About />
                  </div>
                </User.Root>
              </User.Provider>
              <div className="mt-4 px-5">
                <h3 className="mb-4 text-lg font-semibold">Notes</h3>
                <EventList id={pubkey} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowVirtualizer>
  );
}
