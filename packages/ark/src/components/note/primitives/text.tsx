import { NDKEvent } from "@nostr-dev-kit/ndk";
import { Note } from "..";
import { useArk } from "../../../provider";

export function TextNote({
	event,
	className,
}: { event: NDKEvent; className?: string }) {
	const ark = useArk();
	const thread = ark.getEventThread({ tags: event.tags });

	return (
		<Note.Provider event={event}>
			<Note.Root className={className}>
				<div className="h-14 px-3 flex items-center justify-between">
					<Note.User className="flex-1 pr-1" />
					<Note.Menu />
				</div>
				<Note.Thread thread={thread} className="mb-2" />
				<Note.TextContent content={event.content} className="min-w-0 px-3" />
				<div className="flex h-14 items-center justify-between px-3">
					<Note.Pin />
					<div className="inline-flex items-center gap-10">
						<Note.Reply rootEventId={thread?.rootEventId} />
						<Note.Reaction />
						<Note.Repost />
						<Note.Zap />
					</div>
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
