import { NDKEvent } from "@nostr-dev-kit/ndk";
import { Note } from "..";

export function ChildReply({
	event,
}: { event: NDKEvent; rootEventId?: string }) {
	return (
		<Note.Provider event={event}>
			<Note.Root className="gap-2 pl-4 mb-5">
				<div className="flex items-center justify-between px-3 h-14">
					<Note.User className="flex-1 pr-1" />
					<Note.Menu />
				</div>
				<Note.Content className="min-w-0" />
				<div className="flex items-center gap-10 -ml-1">
					<Note.Reply />
					<Note.Reaction />
					<Note.Repost />
					<Note.Zap />
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
