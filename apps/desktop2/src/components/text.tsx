import type { Event } from "@lume/types";
import { cn } from "@lume/utils";
import { Note } from "./note";

export function TextNote({
	event,
	className,
}: {
	event: Event;
	className?: string;
}) {
	return (
		<Note.Provider event={event}>
			<Note.Root
				className={cn(
					"bg-white dark:bg-black/20 backdrop-blur-lg rounded-xl shadow-primary dark:ring-1 ring-neutral-800/50",
					className,
				)}
			>
				<div className="px-3 h-14 flex items-center justify-between">
					<Note.User />
					<Note.Menu />
				</div>
				<Note.Content className="px-3" />
				<div className="mt-3 flex items-center gap-4 h-14 px-3">
					<Note.Open />
					<Note.Reply />
					<Note.Repost />
					<Note.Zap />
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
