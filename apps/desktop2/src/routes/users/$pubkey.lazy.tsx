import { createLazyFileRoute } from "@tanstack/react-router";
import { WindowVirtualizer } from "virtua";
import { Box, Container, User } from "@lume/ui";
import { EventList } from "./-components/eventList";

export const Route = createLazyFileRoute("/users/$pubkey")({
  component: Screen,
});

function Screen() {
  const { pubkey } = Route.useParams();

  return (
    <Container withDrag>
      <Box className="px-0 scrollbar-none">
        <WindowVirtualizer>
          <User.Provider pubkey={pubkey}>
            <User.Root>
              <User.Cover className="h-44 w-full object-cover" />
              <div className="relative -mt-8 flex flex-col gap-4 px-3">
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
          <div className="mt-4">
            <div className="px-3">
              <h3 className="text-lg font-semibold">Latest notes</h3>
            </div>
            <EventList id={pubkey} />
          </div>
        </WindowVirtualizer>
      </Box>
    </Container>
  );
}
