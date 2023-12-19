import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useArk } from '@libs/ark/provider';
import { Note } from '..';

export function TextNote({ event }: { event: NDKEvent }) {
  const ark = useArk();
  const thread = ark.getEventThread({ tags: event.tags });

  return (
    <Note.Root>
      <Note.User pubkey={event.pubkey} time={event.created_at} />
      {thread ? (
        <div className="w-full px-3">
          <div className="flex h-min w-full flex-col gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
            {thread.rootEventId ? (
              <Note.Child eventId={thread.rootEventId} isRoot />
            ) : null}
            {thread.replyEventId ? <Note.Child eventId={thread.replyEventId} /> : null}
            <button
              type="button"
              className="self-start text-blue-500 hover:text-blue-600"
            >
              Show full thread
            </button>
          </div>
        </div>
      ) : null}
      <Note.Content content={event.content} />
      <div className="flex h-14 items-center justify-between px-3">
        <div />
        <div className="inline-flex items-center gap-10">
          <Note.Reply eventId={event.id} rootEventId={thread?.rootEventId} />
          <Note.Reaction event={event} />
          <Note.Repost event={event} />
          <Note.Zap event={event} />
        </div>
      </div>
    </Note.Root>
  );
}
