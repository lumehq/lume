import { useEvent } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { Box, Container, Note, User } from "@lume/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import { WindowVirtualizer } from "virtua";
import { ReplyList } from "./-components/replyList";
import { Event } from "@lume/types";

export const Route = createLazyFileRoute("/events/$eventId")({
  component: Event,
});

function Event() {
  const { eventId } = Route.useParams();
  const { isLoading, isError, data } = useEvent(eventId);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderIcon className="size-5 animate-spin" />
      </div>
    );
  }

  if (isError) {
    <div className="flex h-full w-full items-center justify-center">
      <p>Not found.</p>
    </div>;
  }

  return (
    <WindowVirtualizer>
      <Container withDrag>
        <Box className="px-3 pt-3">
          <MainNote data={data} />
          {data ? <ReplyList eventId={eventId} /> : null}
        </Box>
      </Container>
    </WindowVirtualizer>
  );
}

function MainNote({ data }: { data: Event }) {
  return (
    <Note.Provider event={data}>
      <Note.Root className="flex flex-col pb-3">
        <User.Provider pubkey={data.pubkey}>
          <User.Root className="mb-3 flex flex-1 items-center gap-3">
            <User.Avatar className="size-11 shrink-0 rounded-full object-cover ring-1 ring-neutral-200/50 dark:ring-neutral-800/50" />
            <div className="flex flex-1 flex-col">
              <User.Name className="font-semibold text-neutral-900 dark:text-neutral-100" />
              <div className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <User.Time time={data.created_at} />
                <span>·</span>
                <User.NIP05 />
              </div>
            </div>
          </User.Root>
        </User.Provider>
        <Note.Thread className="mb-2" />
        <Note.Content className="min-w-0" />
        <div className="mt-4 flex items-center justify-between">
          <div className="-ml-1 inline-flex items-center gap-4">
            <Note.Repost />
            <Note.Zap />
          </div>
          <Note.Menu />
        </div>
      </Note.Root>
    </Note.Provider>
  );
}
