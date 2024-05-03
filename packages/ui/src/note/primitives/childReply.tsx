import type { Event } from "@lume/types";
import { Note } from "..";

export function ChildReply({ event }: { event: Event; rootEventId?: string }) {
	return (
		<Note.Provider event={event}>
			<Note.Root className="py-2">
				<div className="flex items-center justify-between h-14">
					<Note.User className="flex-1 pr-2" />
					<Note.Menu />
				</div>
				<Note.Content />
				<div className="flex items-center justify-end gap-4 mt-2">
					<Note.Repost />
					<Note.Zap />
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
