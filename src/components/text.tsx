import { cn } from "@/commons";
import { Note } from "@/components/note";
import type { LumeEvent } from "@/system";
import { memo } from "react";

export const TextNote = memo(function TextNote({
	event,
	className,
}: {
	event: LumeEvent;
	className?: string;
}) {
	return (
		<Note.Provider event={event}>
			<Note.Root className={cn("", className)}>
				<div className="flex items-center justify-between px-3 h-14">
					<Note.User />
					<Note.Menu />
				</div>
				<Note.Content className="px-3" />
				<div className="flex items-center gap-2 px-3 mt-3 h-14">
					<Note.Open />
					<Note.Reply />
					<Note.Repost />
					<Note.Zap />
				</div>
			</Note.Root>
		</Note.Provider>
	);
});
