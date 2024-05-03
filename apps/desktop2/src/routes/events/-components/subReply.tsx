import type { Event } from "@lume/types";
import { Note } from "@lume/ui";

export function SubReply({ event }: { event: Event; rootEventId?: string }) {
	return (
		<Note.Provider event={event}>
			<Note.Root>
				<div className="px-3 h-14 flex items-center justify-between">
					<Note.User />
					<Note.Menu />
				</div>
				<Note.ContentLarge className="px-3" />
				<div className="mt-3 flex items-center gap-4 px-3">
					<Note.Reply />
					<Note.Repost />
					<Note.Zap />
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
