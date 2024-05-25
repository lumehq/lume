import { NostrQuery, useEvent } from "@lume/system";
import type { NostrEvent } from "@lume/types";
import { Box, Container, Spinner } from "@lume/ui";
import { Note } from "@/components/note";
import { createFileRoute } from "@tanstack/react-router";
import { WindowVirtualizer } from "virtua";
import { ReplyList } from "./-components/replyList";

export const Route = createFileRoute("/events/$eventId")({
  beforeLoad: async () => {
    const settings = await NostrQuery.getSettings();
    return { settings };
  },
  component: Screen,
});

function Screen() {
  const { eventId } = Route.useParams();
  const { isLoading, isError, data } = useEvent(eventId);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    );
  }

  if (isError) {
    <div className="flex h-full w-full items-center justify-center">
      <p>Not found.</p>
    </div>;
  }

  return (
    <Container withDrag>
      <Box className="scrollbar-none">
        <WindowVirtualizer>
          <MainNote data={data} />
          {data ? (
            <ReplyList eventId={eventId} />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Spinner className="size-5" />
            </div>
          )}
        </WindowVirtualizer>
      </Box>
    </Container>
  );
}

function MainNote({ data }: { data: NostrEvent }) {
  return (
    <Note.Provider event={data}>
      <Note.Root>
        <div className="px-3 h-14 flex items-center justify-between">
          <Note.User />
          <Note.Menu />
        </div>
        <Note.ContentLarge className="px-3" />
        <div className="mt-4 h-11 gap-2 flex items-center justify-end px-3">
          <Note.Reply large />
          <Note.Repost large />
          <Note.Zap large />
        </div>
      </Note.Root>
    </Note.Provider>
  );
}
