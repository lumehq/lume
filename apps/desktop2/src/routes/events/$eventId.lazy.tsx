import { ReplyList, ThreadNote } from "@lume/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import { WindowVirtualizer } from "virtua";

export const Route = createLazyFileRoute("/events/$eventId")({
  component: Event,
});

function Event() {
  const { eventId } = Route.useParams();

  return (
    <div className="relative h-screen w-screen overflow-y-auto overflow-x-hidden">
      <div data-tauri-drag-region className="h-11 w-full" />
      <WindowVirtualizer>
        <div className="px-6">
          <ThreadNote eventId={eventId} />
          <ReplyList eventId={eventId} />
        </div>
      </WindowVirtualizer>
    </div>
  );
}
