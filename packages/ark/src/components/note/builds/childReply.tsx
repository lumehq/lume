import { NDKEvent } from "@nostr-dev-kit/ndk";
import { Note } from "..";

export function ChildReply({
	event,
	rootEventId,
}: { event: NDKEvent; rootEventId?: string }) {
	return (
		<Note.Provider event={event}>
			<Note.Root>
				<Note.User />
				<Note.TextContent content={event.content} className="min-w-0" />
				<div className="-ml-1 flex h-14 items-center gap-10">
					<Note.Reply rootEventId={rootEventId} />
					<Note.Reaction />
					<Note.Repost />
					<Note.Zap />
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
