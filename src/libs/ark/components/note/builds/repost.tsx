import { NDKEvent, NDKKind, NostrEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useArk } from '@libs/ark/provider';
import { Note } from '..';

export function RepostNote({ event }: { event: NDKEvent }) {
  const ark = useArk();
  const {
    isLoading,
    isError,
    data: repostEvent,
  } = useQuery({
    queryKey: ['repost', event.id],
    queryFn: async () => {
      try {
        if (event.content.length > 50) {
          const embed = JSON.parse(event.content) as NostrEvent;
          return new NDKEvent(ark.ndk, embed);
        }
        const id = event.tags.find((el) => el[0] === 'e')[1];
        return await ark.getEventById({ id });
      } catch {
        throw new Error('Failed to get repost event');
      }
    },
    refetchOnWindowFocus: false,
  });

  const renderContentByKind = () => {
    if (!repostEvent) return null;
    switch (repostEvent.kind) {
      case NDKKind.Text:
        return <Note.TextContent content={repostEvent.content} />;
      case 1063:
        return <Note.MediaContent tags={repostEvent.tags} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="w-full px-3 pb-3"></div>;
  }

  if (isError) {
    return (
      <div className="my-3 h-min w-full px-3">
        <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl bg-neutral-50 pt-3 dark:bg-neutral-950">
          <div className="relative flex flex-col gap-2">
            <div className="px-3">
              <p>Failed to load event</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Note.Root>
      <Note.User
        pubkey={event.pubkey}
        time={event.created_at}
        variant="repost"
        className="h-14"
      />
      <div className="relative flex flex-col gap-2 px-3">
        <Note.User pubkey={repostEvent.pubkey} time={repostEvent.created_at} />
        {renderContentByKind()}
        <div className="flex h-14 items-center justify-between">
          <Note.Pin eventId={event.id} />
          <div className="inline-flex items-center gap-10">
            <Note.Reply eventId={repostEvent.id} />
            <Note.Reaction event={repostEvent} />
            <Note.Repost event={repostEvent} />
            <Note.Zap event={repostEvent} />
          </div>
        </div>
      </div>
    </Note.Root>
  );
}
