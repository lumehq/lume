import { cn } from "@lume/utils";
import { Note } from "@/components/note";
import type { LumeEvent } from "@lume/system";

export function TextNote({
	event,
	className,
}: {
	event: LumeEvent;
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
				<div className="flex items-center justify-between px-3 h-14">
					<Note.User />
					<Note.Menu />
				</div>
				<Note.Content className="px-3" />
				<div className="flex items-center gap-4 px-3 mt-3 h-14">
					<Note.Open />
					<Note.Reply />
					<Note.Repost />
					<Note.Zap />
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
