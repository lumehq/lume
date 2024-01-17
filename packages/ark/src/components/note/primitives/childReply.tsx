import { NDKEvent } from "@nostr-dev-kit/ndk";
import { Note } from "..";

export function ChildReply({
	event,
}: { event: NDKEvent; rootEventId?: string }) {
	return (
		<Note.Provider event={event}>
			<Note.Root className="pl-6">
				<div className="flex items-center justify-between h-14">
					<Note.User className="flex-1" />
					<Note.Menu />
				</div>
				<Note.Content />
				<div className="flex items-center justify-end gap-10 mt-4">
					<Note.Repost />
					<Note.Zap />
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
